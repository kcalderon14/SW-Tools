import { testRedirect } from './redirectProxy.js';
import { resolveDns } from './dnsResolver.js';

export default function redirectTestPlugin() {
  return {
    name: 'redirect-test-proxy',
    configureServer(server) {
      server.middlewares.use('/api/test-redirect', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        let bodySize = 0;
        const MAX_BODY = 1024 * 1024; // 1MB limit
        req.on('data', (chunk) => {
          bodySize += chunk.length;
          if (bodySize > MAX_BODY) {
            req.destroy();
            res.writeHead(413, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Request body too large' }));
            return;
          }
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const { url, stagingIp } = JSON.parse(body);
            if (!url || typeof url !== 'string') {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Missing url parameter' }));
              return;
            }

            const result = await testRedirect(url, stagingIp || null);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
          } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid request body' }));
          }
        });
      });

      server.middlewares.use('/api/resolve-dns', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        let bodySize = 0;
        const MAX_BODY = 1024 * 1024; // 1MB limit
        req.on('data', (chunk) => {
          bodySize += chunk.length;
          if (bodySize > MAX_BODY) {
            req.destroy();
            res.writeHead(413, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Request body too large' }));
            return;
          }
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const { hostname } = JSON.parse(body);
            if (!hostname || typeof hostname !== 'string') {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Missing hostname parameter' }));
              return;
            }

            const ALLOWED_HOSTNAMES = ['swdc-ion.edgekey-staging.net'];
            if (!ALLOWED_HOSTNAMES.includes(hostname.trim().toLowerCase())) {
              res.writeHead(403, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Hostname not in allowlist' }));
              return;
            }

            const result = await resolveDns(hostname);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
          } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid request body' }));
          }
        });
      });
    },
  };
}
