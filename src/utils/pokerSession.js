export function generateSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function buildShareableUrl(sessionId) {
  return `${window.location.origin}/Point-Poker/${sessionId}`;
}

export function storageKey(sessionId) {
  return 'poker-session-' + sessionId;
}
