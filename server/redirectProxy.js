import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

const IPV4_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

function isSSLError(err) {
  const msg = ((err && err.message) || '').toLowerCase();
  return msg.includes('eproto') || msg.includes('ssl') || msg.includes('tlsv1') || msg.includes('err_ssl');
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
      const msg = err.message || '';
      if (isSSLError(err)) {
        resolve({ statusCode: null, location: null, error: 'SSL/TLS handshake failed - retrying over HTTP' });
      } else {
        resolve({ statusCode: null, location: null, error: msg });
      }
    });

    req.end();
  });
}

function isPrivateIp(ip) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) return true;
  if (parts[0] === 127) return true;
  if (parts[0] === 10) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  if (parts[0] === 169 && parts[1] === 254) return true;
  if (parts.every((p) => p === 0)) return true;
  return false;
}

function isBlockedHost(hostname) {
  if (!hostname) return true;
  const lower = hostname.toLowerCase();
  if (lower === 'localhost' || lower === '[::1]') return true;
  if (IPV4_REGEX.test(lower) && isPrivateIp(lower)) return true;
  return false;
}

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

  if (isHttps && result.error && isSSLError({ message: result.error })) {
    const httpOptions = {
      ...options,
      port: 80,
    };

    delete httpOptions.servername;
    delete httpOptions.rejectUnauthorized;
    delete httpOptions.minVersion;

    const httpResult = await makeRequest(httpOptions, http);
    if (!httpResult.error) {
      return httpResult;
    }

    return {
      statusCode: null,
      location: null,
      error: 'SSL/TLS handshake failed and HTTP fallback also failed',
    };
  }

  return result;
}
