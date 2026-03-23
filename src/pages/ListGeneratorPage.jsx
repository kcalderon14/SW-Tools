import { useState } from 'react';
import { generateListHtml } from '../utils/listGenerator';

const inputClass =
  'bg-dark-surface text-white border border-gray-600 rounded px-3 py-2 w-full focus:border-teal focus:outline-none';
const buttonClass =
  'bg-teal hover:bg-teal-hover text-white font-bold px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

export default function ListGeneratorPage() {
  const [listType, setListType] = useState('ul');
  const [inputText, setInputText] = useState('');
  const [enableListClass, setEnableListClass] = useState(false);
  const [listClassName, setListClassName] = useState('');
  const [enableItemClass, setEnableItemClass] = useState(false);
  const [itemClassName, setItemClassName] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const html = generateListHtml({
      lines: inputText,
      listType,
      listClass: enableListClass ? listClassName : '',
      itemClass: enableItemClass ? itemClassName : '',
    });
    setGeneratedHtml(html);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  const handleClear = () => {
    setListType('ul');
    setInputText('');
    setEnableListClass(false);
    setListClassName('');
    setEnableItemClass(false);
    setItemClassName('');
    setGeneratedHtml('');
    setCopied(false);
  };

  return (
    <div className="space-y-6">
      <header className="border-b-2 border-teal pb-3">
        <h1 className="text-3xl font-bold text-white">HTML Helpers</h1>
      </header>

      <section className="bg-dark-bg border border-gray-700 rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold text-white mb-4">List Generator</h2>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setListType('ul')}
            className={`px-4 py-2 rounded transition-colors ${
              listType === 'ul'
                ? 'bg-teal text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Unordered List (&lt;ul&gt;)
          </button>
          <button
            type="button"
            onClick={() => setListType('ol')}
            className={`px-4 py-2 rounded transition-colors ${
              listType === 'ol'
                ? 'bg-teal text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Ordered List (&lt;ol&gt;)
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
          <div className="bg-dark-surface border border-gray-700 rounded-lg p-4 space-y-4">
            <label className="text-sm font-medium text-gray-300 mb-1 block">
              List Items (one per line, indent with spaces for sub-items)
            </label>
            <textarea
              className={`${inputClass} min-h-[200px] font-mono`}
              placeholder={"Fruits\n  Apple\n  Banana\nVegetables\n  Carrot"}
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
            />
          </div>

          <div className="bg-dark-surface border border-gray-700 rounded-lg p-4 space-y-4">
            <p className="text-sm font-medium text-gray-300 mb-2">Configuration</p>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-teal"
                  checked={enableListClass}
                  onChange={(event) => setEnableListClass(event.target.checked)}
                />
                Add class to list element
              </label>
              {enableListClass && (
                <input
                  type="text"
                  className={`${inputClass} mt-2`}
                  placeholder="e.g. my-list"
                  value={listClassName}
                  onChange={(event) => setListClassName(event.target.value)}
                />
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-teal"
                  checked={enableItemClass}
                  onChange={(event) => setEnableItemClass(event.target.checked)}
                />
                Add class to list items
              </label>
              {enableItemClass && (
                <input
                  type="text"
                  className={`${inputClass} mt-2`}
                  placeholder="e.g. my-list-item"
                  value={itemClassName}
                  onChange={(event) => setItemClassName(event.target.value)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className={buttonClass}
            onClick={handleGenerate}
            disabled={!inputText.trim()}
          >
            Generate
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={handleCopy}
            disabled={!generatedHtml}
          >
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          <button
            type="button"
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded transition-colors"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </section>

      {generatedHtml && (
        <section className="bg-dark-bg border border-gray-700 rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Generated HTML</h2>
          <div className="bg-dark-surface rounded-lg p-4 overflow-x-auto">
            <code className="text-teal font-mono text-sm whitespace-pre-wrap break-all">{generatedHtml}</code>
          </div>
        </section>
      )}
    </div>
  );
}
