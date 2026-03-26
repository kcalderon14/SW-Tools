import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { testRedirect } from './redirectProxy.js';
import { resolveDns } from './dnsResolver.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// API endpoint
app.post('/api/test-redirect', async (req, res) => {
  const { url, stagingIp } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  const result = await testRedirect(url, stagingIp || null);
  res.json(result);
});

const ALLOWED_HOSTNAMES = ['swdc-ion.edgekey-staging.net'];

app.post('/api/resolve-dns', async (req, res) => {
  const { hostname } = req.body || {};
  if (!hostname || typeof hostname !== 'string') {
    return res.status(400).json({ error: 'Missing hostname parameter' });
  }
  if (!ALLOWED_HOSTNAMES.includes(hostname.trim().toLowerCase())) {
    return res.status(403).json({ error: 'Hostname not in allowlist' });
  }
  const result = await resolveDns(hostname);
  res.json(result);
});

// Serve static files from Vite build
app.use(express.static(join(__dirname, '..', 'dist')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});