import { useState } from 'react';

export default function ShareSession({ sessionUrl }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!sessionUrl) return;

    try {
      await navigator.clipboard.writeText(sessionUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        readOnly
        value={sessionUrl || ''}
        className="bg-bg-primary border border-border-light rounded text-text-primary text-sm px-3 py-2 flex-1"
      />

      <button
        type="button"
        onClick={handleCopy}
        className="bg-teal hover:bg-teal-hover px-3 py-2 rounded text-white transition-colors inline-flex items-center gap-2"
        aria-label="Copy session URL"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
          <path d="M6 2a2 2 0 00-2 2v8a2 2 0 002 2h1v2a2 2 0 002 2h7a2 2 0 002-2V8a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H6zm7 4V4H6v8h1V8a2 2 0 012-2h4zm-4 2v8h7V8H9z" />
        </svg>
        Copy
      </button>

      {copied && <span className="text-sm text-teal">Copied!</span>}
    </div>
  );
}
