import { useState } from 'react';
import { useRedirectTester } from '../hooks/useRedirectTester';
import TestResultsTable from '../components/TestResultsTable';
import { STAGING_HOSTNAME } from '../config/data';

export default function RedirectTestingPage() {
  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState('');
  const [stagingIp, setStagingIp] = useState('');
  const [customIp, setCustomIp] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [locExpandFrom, setLocExpandFrom] = useState(false);
  const [locExpandTo, setLocExpandTo] = useState(false);
  const [resolvedIp, setResolvedIp] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [resolveError, setResolveError] = useState(null);
  const { results, progress, isTesting, totalCount, startTest, cancelTest, clearResults } = useRedirectTester();

  const textareaClass =
    'bg-dark-surface text-white border border-gray-600 rounded px-3 py-2 w-full font-mono text-sm focus:border-teal focus:outline-none resize-none';
  const buttonClass =
    'bg-teal hover:bg-teal-hover text-white font-bold px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const fromLines = fromText.trim() ? fromText.trim().split('\n').filter((l) => l.trim()) : [];
  const toLines = toText.trim() ? toText.trim().split('\n').filter((l) => l.trim()) : [];
  const canTest = fromLines.length > 0 && !isTesting && !isResolving;
  const mismatch = fromLines.length > 0 && toLines.length > 1 && fromLines.length !== toLines.length;

  const handleTest = async () => {
    let ip;

    if (stagingIp === 'resolve') {
      setIsResolving(true);
      setResolveError(null);
      try {
        const response = await fetch('/api/resolve-dns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hostname: STAGING_HOSTNAME }),
        });
        const data = await response.json();
        if (data.error) {
          setResolveError(data.error);
          setIsResolving(false);
          return;
        }
        ip = data.ip;
        setResolvedIp(data.ip);
      } catch {
        setResolveError('Failed to resolve DNS');
        setIsResolving(false);
        return;
      }
      setIsResolving(false);
    } else if (stagingIp === 'custom') {
      ip = customIp.trim();
      setResolvedIp(null);
    } else {
      ip = stagingIp || null;
      setResolvedIp(null);
    }

    startTest(fromLines, toLines, ip, { locExpandFrom, locExpandTo });
  };

  const handleClear = () => {
    setFromText('');
    setToText('');
    setStagingIp('');
    setCustomIp('');
    setCustomDomain('');
    setLocExpandFrom(false);
    setLocExpandTo(false);
    setResolvedIp(null);
    setResolveError(null);
    setIsResolving(false);
    clearResults();
  };

  const getRows = (text) => Math.max(10, text.split('\n').length);

  const passCount = results.filter((r) => r.pass).length;
  const failCount = results.filter((r) => !r.pass).length;

  return (
    <div className="space-y-6">
      <header className="border-b-2 border-teal pb-3">
        <h1 className="text-3xl font-bold text-white">Redirect Testing</h1>
      </header>

      <section className="bg-dark-bg border border-gray-700 rounded-lg p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-dark-surface border border-gray-700 rounded-lg p-4">
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              From URLs ({fromLines.length} {fromLines.length === 1 ? 'URL' : 'URLs'})
            </label>
            <textarea
              className={textareaClass}
              rows={getRows(fromText)}
              placeholder="Enter URLs to test (one per line)&#10;e.g. https://www.solarwinds.com/old-page"
              value={fromText}
              onChange={(e) => setFromText(e.target.value)}
              disabled={isTesting}
            />
            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input
                type="checkbox"
                className="accent-teal"
                checked={locExpandFrom}
                onChange={(e) => {
                  setLocExpandFrom(e.target.checked);
                  if (!e.target.checked) setLocExpandTo(false);
                }}
                disabled={isTesting}
              />
              <span className="text-sm text-gray-300">Test all LOC versions</span>
            </label>
            {locExpandFrom && (
              <p className="mt-1 text-xs text-gray-400">
                Each EN URL will be expanded to test /de/, /es/, /fr/, /ja/, /ko/, /pt/, /zh/ versions.
              </p>
            )}
          </div>
          <div className="bg-dark-surface border border-gray-700 rounded-lg p-4">
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Expected To URLs ({toLines.length} {toLines.length === 1 ? 'URL' : 'URLs'})
            </label>
            <textarea
              className={textareaClass}
              rows={getRows(toText)}
              placeholder="Enter expected redirect targets (one per line)&#10;e.g. https://www.solarwinds.com/new-page"
              value={toText}
              onChange={(e) => setToText(e.target.value)}
              disabled={isTesting}
            />
            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input
                type="checkbox"
                className="accent-teal"
                checked={locExpandTo}
                onChange={(e) => setLocExpandTo(e.target.checked)}
                disabled={isTesting || !locExpandFrom}
              />
              <span className={`text-sm ${!locExpandFrom ? 'text-gray-500' : 'text-gray-300'}`}>
                Expand Expected URLs to LOC versions
              </span>
            </label>
            {locExpandTo && locExpandFrom && (
              <p className="mt-1 text-xs text-gray-400">
                Each LOC From URL will be matched to its corresponding LOC Expected URL.
              </p>
            )}
            {!locExpandFrom && (
              <p className="mt-1 text-xs text-gray-500">
                Enable "Test all LOC versions" on From URLs first.
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 bg-dark-surface border border-gray-700 rounded-lg p-4">
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            Test Environment
          </label>
          <select
            className="bg-dark-surface text-white border border-gray-600 rounded px-3 py-2 w-full focus:border-teal focus:outline-none"
            value={stagingIp}
            onChange={(e) => setStagingIp(e.target.value)}
            disabled={isTesting}
          >
            <option value="">Production (no override)</option>
            <option value="resolve">Staging (Auto-resolve)</option>
            <option value="custom">Custom Server...</option>
          </select>

          {stagingIp === 'resolve' && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded bg-teal/20 px-2 py-1 text-xs font-medium text-teal">
                  Auto-resolve
                </span>
                <span className="text-xs text-gray-400 font-mono">{STAGING_HOSTNAME}</span>
              </div>
              {resolvedIp && (
                <p className="text-xs text-gray-400">
                  Last resolved IP: <span className="text-teal font-mono">{resolvedIp}</span>
                </p>
              )}
              {resolveError && (
                <p className="text-xs text-error">{resolveError}</p>
              )}
              {isResolving && (
                <p className="text-xs text-gray-400">Resolving DNS...</p>
              )}
            </div>
          )}

          {stagingIp === 'custom' && (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Server IP</label>
                <input
                  type="text"
                  className="bg-dark-bg text-white border border-gray-600 rounded px-3 py-2 w-full text-sm focus:border-teal focus:outline-none"
                  placeholder="e.g. 23.50.51.34"
                  value={customIp}
                  onChange={(e) => setCustomIp(e.target.value)}
                  disabled={isTesting}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Domain (optional note)</label>
                <input
                  type="text"
                  className="bg-dark-bg text-white border border-gray-600 rounded px-3 py-2 w-full text-sm focus:border-teal focus:outline-none"
                  placeholder="e.g. www.solarwinds.com"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  disabled={isTesting}
                />
              </div>
              <span className="inline-flex items-center rounded bg-teal/20 px-2 py-1 text-xs font-medium text-teal w-fit">
                Custom
              </span>
            </div>
          )}
        </div>

        {mismatch && (
          <div className="mt-3 rounded bg-dark-surface border border-error px-4 py-2 text-sm text-error">
            Warning: From URLs ({fromLines.length}) and To URLs ({toLines.length}) have different counts. Extra entries will be marked as unmatched.
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className={buttonClass} onClick={handleTest} disabled={!canTest}>
            Test Redirects
          </button>
          {isTesting && (
            <button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded transition-colors"
              onClick={cancelTest}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded transition-colors"
            onClick={handleClear}
            disabled={isTesting}
          >
            Clear
          </button>
        </div>
      </section>

      {isTesting && (
        <section className="bg-dark-bg border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Testing redirects...</span>
            <span className="text-sm font-semibold text-teal">{progress}%</span>
          </div>
          <div className="w-full bg-dark-surface rounded-full h-4 overflow-hidden">
            <div
              className="bg-teal h-4 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-400">
            {results.length} of {totalCount} URLs tested
          </p>
        </section>
      )}

      {results.length > 0 && !isTesting && (
        <section className="bg-dark-bg border border-gray-700 rounded-lg p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Results</h2>
            <div className="flex gap-4 text-sm">
              <span className="text-success font-semibold">{passCount} passed</span>
              <span className="text-error font-semibold">{failCount} failed</span>
            </div>
          </div>
          {resolvedIp && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded bg-teal/20 px-2 py-1 text-xs font-medium text-teal">
                Server IP
              </span>
              <span className="text-xs text-gray-400">
                Tested against <span className="text-teal font-mono">{resolvedIp}</span> (resolved from {STAGING_HOSTNAME})
              </span>
            </div>
          )}
          <TestResultsTable results={results} />
        </section>
      )}

      {results.length > 0 && isTesting && (
        <section className="bg-dark-bg border border-gray-700 rounded-lg p-4 md:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Results (in progress...)</h2>
          {resolvedIp && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded bg-teal/20 px-2 py-1 text-xs font-medium text-teal">
                Server IP
              </span>
              <span className="text-xs text-gray-400">
                Tested against <span className="text-teal font-mono">{resolvedIp}</span> (resolved from {STAGING_HOSTNAME})
              </span>
            </div>
          )}
          <TestResultsTable results={results} />
        </section>
      )}
    </div>
  );
}
