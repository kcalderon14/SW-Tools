import { useState } from 'react';
import { useRedirectTester } from '../hooks/useRedirectTester';
import TestResultsTable from '../components/TestResultsTable';

export default function RedirectTestingPage() {
  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState('');
  const { results, progress, isTesting, startTest, cancelTest, clearResults } = useRedirectTester();

  const textareaClass =
    'bg-dark-surface text-white border border-gray-600 rounded px-3 py-2 w-full font-mono text-sm focus:border-teal focus:outline-none resize-none';
  const buttonClass =
    'bg-teal hover:bg-teal-hover text-white font-bold px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const fromLines = fromText.trim() ? fromText.trim().split('\n').filter((l) => l.trim()) : [];
  const toLines = toText.trim() ? toText.trim().split('\n').filter((l) => l.trim()) : [];
  const canTest = fromLines.length > 0 && !isTesting;
  const mismatch = fromLines.length > 0 && toLines.length > 0 && fromLines.length !== toLines.length;

  const handleTest = () => {
    startTest(fromLines, toLines);
  };

  const handleClear = () => {
    setFromText('');
    setToText('');
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
          </div>
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
            {results.length} of {fromLines.length} URLs tested
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
          <TestResultsTable results={results} />
        </section>
      )}

      {results.length > 0 && isTesting && (
        <section className="bg-dark-bg border border-gray-700 rounded-lg p-4 md:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Results (in progress...)</h2>
          <TestResultsTable results={results} />
        </section>
      )}
    </div>
  );
}
