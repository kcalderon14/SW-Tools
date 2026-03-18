import { useState, useEffect } from 'react';

export default function LocalizationModal({ isOpen, locText, hasLanguages, onConfirm, onDismiss }) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (isOpen) setText(locText || '');
  }, [isOpen, locText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={onDismiss}>
      <div className="bg-dark-surface rounded-lg p-6 w-[65%] max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <h4 className="text-lg font-semibold text-white mb-4">
          {hasLanguages ? 'Generate localized URLs' : 'Selected site has no localized versions'}
        </h4>
        <div>
          <label className="text-sm text-gray-300 mb-1 block">URLs:</label>
          <textarea
            rows={10}
            className="bg-dark-bg text-white border border-gray-600 rounded px-3 py-2 w-full font-mono text-sm focus:border-teal focus:outline-none resize-none mb-4"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex gap-3">
            <button
              className="bg-teal hover:bg-teal-hover text-white font-bold px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => onConfirm(text)}
              disabled={!hasLanguages}
            >
              CONFIRM
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded transition-colors"
              onClick={onDismiss}
            >
              DISMISS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
