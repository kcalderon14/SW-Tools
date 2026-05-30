// In-memory session store (cleared on server restart)
const sessions = new Map();

export function getSession(sessionId) {
  return sessions.get(sessionId) || null;
}

export function saveSession(sessionId, session) {
  sessions.set(sessionId, session);
}

export function deleteSession(sessionId) {
  sessions.delete(sessionId);
}
