import http from 'http';
import https from 'https';
import { URL } from 'url';

const IPV4_REGEX = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;

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

function isPrivateIp(ip) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) return true;
  // Loopback
  if (parts[0] === 127) return true;
  // Private ranges
  if (parts[0] === 10) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  // Link-local / metadata
  if (parts[0] === 169 && parts[1] === 254) return true;
  // 0.0.0.0
  if (parts.every((p) => p === 0)) return true;
  return false;
}

function isBlockedHost(hostname) {
  if (!hostname) return true;
  const lower = hostname.toLowerCase();
  // Block localhost variants
  if (lower === 'localhost' || lower === '[::1]') return true;
  // Block if it's an IP and it's private
  if (IPV4_REGEX.test(lower) && isPrivateIp(lower)) return true;
  return false;
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

  // Block requests to private/internal networks
  if (isBlockedHost(parsed.hostname)) {
    return { statusCode: null, location: null, error: 'Requests to internal/private addresses are not allowed' };
  }

  if (stagingIp && !IPV4_REGEX.test(stagingIp)) {
    return { statusCode: null, location: null, error: 'Invalid staging IP address' };
  }

  if (stagingIp && isPrivateIp(stagingIp)) {
    return { statusCode: null, location: null, error: 'Staging IP must not be a private/internal address' };
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
