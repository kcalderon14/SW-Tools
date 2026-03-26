import { resolveDns } from '../server/dnsResolver.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { hostname } = req.body || {};

  if (!hostname || typeof hostname !== 'string') {
    return res.status(400).json({ error: 'Missing hostname parameter' });
  }

  const result = await resolveDns(hostname);
  return res.status(200).json(result);
}
