import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

const IPV4_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

function isSSLError(err) {
  const msg = (err && err.message) || '';
  return msg.includes('EPROTO') || msg.includes('SSL') || msg.includes('ERR_SSL');
}

function makeRequest(options, client) {
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

async function testRedirect(targetUrl, stagingIp = null) {
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
    options.minVersion = 'TLSv1.2';
  }

  const result = await makeRequest(options, client);

  if (result.error && isSSLError({ message: result.error }) && isHttps) {
    const httpOptions = { ...options, port: 80 };
    delete httpOptions.servername;
    delete httpOptions.rejectUnauthorized;
    delete httpOptions.minVersion;

    const httpResult = await makeRequest(httpOptions, http);
    if (!httpResult.error) {
      return httpResult;
    }
    return { statusCode: null, location: null, error: 'SSL/TLS handshake failed and HTTP fallback also failed' };
  }

  return result;
}

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

  const { url, stagingIp } = body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  const result = await testRedirect(url, stagingIp || null);
  return res.status(200).json(result);
}
