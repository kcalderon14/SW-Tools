import { useState, useRef, useCallback } from 'react';

function normalizeUrl(url) {
  if (!url) return '';
  let normalized = url.trim().toLowerCase();
  // Remove trailing slash unless it's just "/"
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  // Remove protocol for comparison
  normalized = normalized.replace(/^https?:\/\//, '');
  return normalized;
}

export function useRedirectTester() {
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const abortRef = useRef(null);

  const startTest = useCallback(async (fromUrls, toUrls, stagingIp = null) => {
    if (fromUrls.length === 0) return;

    const controller = new AbortController();
    abortRef.current = controller;

    setIsTesting(true);
    setResults([]);
    setProgress(0);

    const total = fromUrls.length;
    const accumulated = [];

    for (let i = 0; i < total; i++) {
      if (controller.signal.aborted) break;

      const from = fromUrls[i].trim();
      const expectedTo = toUrls[i] ? toUrls[i].trim() : '';

      // Ensure the from URL has a protocol for the fetch
      const testUrl = from.startsWith('http') ? from : `https://${from}`;

      let result;
      try {
        const response = await fetch('/api/test-redirect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: testUrl, stagingIp: stagingIp || undefined }),
          signal: controller.signal,
        });

        const data = await response.json();

        if (data.error) {
          result = {
            index: i + 1,
            from,
            expectedTo,
            actualUrl: null,
            statusCode: null,
            pass: false,
            error: data.error,
          };
        } else {
          const actualUrl = data.location || from;
          const pass = expectedTo
            ? normalizeUrl(actualUrl) === normalizeUrl(expectedTo)
            : false;

          result = {
            index: i + 1,
            from,
            expectedTo: expectedTo || 'N/A',
            actualUrl: data.location || '(no redirect)',
            statusCode: data.statusCode,
            pass,
            error: null,
          };
        }
      } catch (err) {
        if (err.name === 'AbortError') break;
        result = {
          index: i + 1,
          from,
          expectedTo: expectedTo || 'N/A',
          actualUrl: null,
          statusCode: null,
          pass: false,
          error: 'Proxy unreachable',
        };
      }

      accumulated.push(result);
      setResults([...accumulated]);
      setProgress(Math.round(((i + 1) / total) * 100));
    }

    setIsTesting(false);
    abortRef.current = null;
  }, []);

  const cancelTest = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setProgress(0);
    setIsTesting(false);
  }, []);

  return {
    results,
    progress,
    isTesting,
    startTest,
    cancelTest,
    clearResults,
  };
}
