import dns from 'node:dns/promises';

export async function resolveDns(hostname) {
  if (!hostname || typeof hostname !== 'string') {
    return { ip: null, error: 'Missing hostname' };
  }

  const trimmed = hostname.trim();
  if (trimmed.length === 0 || trimmed.length > 253) {
    return { ip: null, error: 'Invalid hostname' };
  }

  try {
    // resolve4 returns an array of IPv4 addresses; take the first one
    const addresses = await dns.resolve4(trimmed);
    return { ip: addresses[0], error: null };
  } catch (err) {
    if (err.code === 'ENOTFOUND') {
      return { ip: null, error: `Hostname not found: ${trimmed}` };
    }
    if (err.code === 'ETIMEOUT' || err.code === 'EAI_AGAIN') {
      return { ip: null, error: 'DNS lookup timed out' };
    }
    return { ip: null, error: err.message || 'DNS resolution failed' };
  }
}
