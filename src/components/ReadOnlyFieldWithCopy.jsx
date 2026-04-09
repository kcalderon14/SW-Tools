import { useState } from 'react';

export default function ReadOnlyFieldWithCopy({ label, value, className }) {
  const [copied, setCopied] = useState(false);
  const hasValue = typeof value === 'string' && value.trim().length > 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <div className={className}>
      {label ? <label className="text-sm font-medium text-gray-300 mb-1 block">{label}</label> : null}

      <div className="flex items-stretch min-w-0">
        <input
          type="text"
          readOnly
          value={value}
          className="bg-gray-800 text-white border-none rounded-l px-3 py-2 flex-1 min-w-0 outline-none cursor-default"
        />

        {hasValue ? (
          <button
            type="button"
            onClick={handleCopy}
            disabled={!hasValue}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-3 py-2 rounded-r transition-colors"
            aria-label={copied ? 'Copied' : 'Copy to clipboard'}
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
}
