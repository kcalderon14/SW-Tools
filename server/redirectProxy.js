import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

export async function testRedirect(targetUrl) {
  // Validate URL and restrict schemes to reduce SSRF risk.
  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return { statusCode: null, location: null, error: 'Invalid URL' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { statusCode: null, location: null, error: 'Only http and https URLs are supported' };
  }

  const client = parsed.protocol === 'https:' ? https : http;

  return new Promise((resolve) => {
    const req = client.request(
      parsed.href,
      {
        method: 'HEAD',
        timeout: 10000,
        rejectUnauthorized: false,
        headers: {
          'User-Agent': 'RedirectTester/1.0',
        },
      },
      (res) => {
        const location = res.headers.location || null;
        resolve({ statusCode: res.statusCode, location, error: null });
        res.resume();
      },
    );

    req.on('timeout', () => {
      req.destroy();
      resolve({ statusCode: null, location: null, error: 'Request timed out' });
    });

    req.on('error', (err) => {
      resolve({ statusCode: null, location: null, error: err.message });
    });

    req.end();
  });
}
