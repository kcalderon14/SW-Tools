import { testRedirect } from './redirectProxy.js';

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
        req.on('data', (chunk) => {
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
    },
  };
}
