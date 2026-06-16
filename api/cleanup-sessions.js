import crypto from 'crypto';
import admin from 'firebase-admin';

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function getBearerToken(authHeader = '') {
  if (!authHeader.startsWith('Bearer ')) {
    return '';
  }
  return authHeader.slice(7);
}

function timingSafeEquals(a = '', b = '') {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

function getAdminApp() {
  if (admin.apps.length === 0) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    const databaseURL = process.env.FIREBASE_DATABASE_URL;

    if (!serviceAccountJson || !databaseURL) {
      throw new Error('Missing FIREBASE_SERVICE_ACCOUNT or FIREBASE_DATABASE_URL environment variables');
    }

    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch {
      throw new Error('FIREBASE_SERVICE_ACCOUNT must be valid JSON');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL,
    });
  }

  return admin.app();
}

export default async function handler(req, res) {
  try {
    const expectedSecret = process.env.CRON_SECRET || '';
    const authHeader = req.headers.authorization || '';
    const incomingToken = getBearerToken(authHeader);

    if (!expectedSecret || !timingSafeEquals(incomingToken, expectedSecret)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const app = getAdminApp();
    const db = app.database();
    const sessionsRef = db.ref('poker-sessions');
    const snapshot = await sessionsRef.once('value');
    const sessions = snapshot.val() || {};

    const cutoff = Date.now() - SESSION_TTL_MS;
    const deleteOps = [];

    for (const [sessionId, sessionData] of Object.entries(sessions)) {
      const createdAt = sessionData?.createdAt;
      const createdAtMs = createdAt ? Date.parse(createdAt) : NaN;
      const isExpired = !createdAt || Number.isNaN(createdAtMs) || createdAtMs < cutoff;

      if (isExpired) {
        deleteOps.push(db.ref(`poker-sessions/${sessionId}`).remove());
      }
    }

    await Promise.all(deleteOps);

    return res.status(200).json({
      deletedSessions: deleteOps.length,
    });
  } catch (error) {
    console.error('cleanup-sessions failed', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}
