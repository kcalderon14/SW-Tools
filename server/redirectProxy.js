import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

const IPV4_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

export async function testRedirect(targetUrl, stagingIp = null) {
  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return { statusCode: null, location: null, error: 'Invalid URL' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { statusCode: null, location: null, error: 'Only http and https URLs are supported' };
  }

  if (stagingIp && !IPV4_REGEX.test(stagingIp)) {
    return { statusCode: null, location: null, error: 'Invalid staging IP address' };
  }

  const isHttps = parsed.protocol === 'https:';
  const client = isHttps ? https : http;
  const defaultPort = isHttps ? 443 : 80;

  const options = {
    method: 'HEAD',
    hostname: stagingIp || parsed.hostname,
    port: parsed.port || defaultPort,
    path: parsed.pathname + parsed.search,
    timeout: 10000,
    rejectUnauthorized: false,
    headers: {
      'User-Agent': 'RedirectTester/1.0',
      'Host': parsed.hostname,
    },
  };

  if (isHttps) {
    options.servername = parsed.hostname;
  }

  return new Promise((resolve) => {
    const req = client.request(options, (res) => {
      const location = res.headers.location || null;
      resolve({ statusCode: res.statusCode, location, error: null });
      res.resume();
    });

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
