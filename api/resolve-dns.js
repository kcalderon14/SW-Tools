import { resolveDns } from '../server/dnsResolver.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid request body' });
    }
  }
  body = body || {};

  const { hostname } = body;

  if (!hostname || typeof hostname !== 'string') {
    return res.status(400).json({ error: 'Missing hostname parameter' });
  }

  const result = await resolveDns(hostname);
  return res.status(200).json(result);
}
