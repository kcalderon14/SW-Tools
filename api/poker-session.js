const sessions = new Map();

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Missing session id' });
    }
    const session = sessions.get(id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    return res.status(200).json(session);
  }

  if (req.method === 'POST') {
    const session = req.body;
    if (!session || !session.id) {
      return res.status(400).json({ error: 'Invalid session data' });
    }
    sessions.set(session.id, session);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
