import { useMemo, useState } from 'react';

const inputClass =
  'bg-dark-surface text-white border border-gray-600 rounded px-3 py-2 w-full focus:border-teal focus:outline-none';
const buttonClass =
  'bg-teal hover:bg-teal-hover text-white font-bold px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

export default function HtmlHelpersPage() {
  const [linkType, setLinkType] = useState('standard');
  const [anchorText, setAnchorText] = useState('');
  const [href, setHref] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [enableLinktype, setEnableLinktype] = useState(false);
  const [linktypeValue, setLinktypeValue] = useState('');
  const [enableLinkdetail, setEnableLinkdetail] = useState(false);
  const [enableAutomationId, setEnableAutomationId] = useState(false);
  const [automationIdValue, setAutomationIdValue] = useState('');
  const [newTab, setNewTab] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatedHtml = useMemo(() => {
    if (!anchorText.trim() || !href.trim()) return '';

    const attrs = [];

    let hrefValue = href.trim();
    if (linkType === 'phone') {
      hrefValue = 'tel:' + href.replace(/[\s\-()]/g, '');
    } else if (linkType === 'email') {
      hrefValue = 'mailto:' + href.trim();
      if (emailSubject.trim()) {
        hrefValue += '?subject=' + encodeURIComponent(emailSubject.trim());
      }
    }

    attrs.push(`href="${hrefValue}"`);

    if (enableLinktype && linktypeValue.trim()) {
      attrs.push(`data-linktype="${linktypeValue.trim()}"`);
    }

    if (enableLinkdetail) {
      attrs.push(`data-linkdetail="${anchorText.trim()} embed"`);
    }

    attrs.push('data-automation-group="link"');

    if (enableAutomationId && automationIdValue.trim()) {
      attrs.push(`data-automation-id="${automationIdValue.trim()}"`);
    }

    if (newTab) {
      attrs.push('target="_blank"');
      attrs.push('rel="noopener noreferrer"');
    }

    return `<a ${attrs.join(' ')}>${anchorText.trim()}</a>`;
  }, [
    linkType,
    anchorText,
    href,
    emailSubject,
    enableLinktype,
    linktypeValue,
    enableLinkdetail,
    enableAutomationId,
    automationIdValue,
    newTab,
  ]);

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
    setLinkType('standard');
    setAnchorText('');
    setHref('');
    setEmailSubject('');
    setEnableLinktype(false);
    setLinktypeValue('');
    setEnableLinkdetail(false);
    setEnableAutomationId(false);
    setAutomationIdValue('');
    setNewTab(false);
    setCopied(false);
  };

  const handleLinkTypeChange = (type) => {
    setLinkType(type);
    setHref('');
    setEmailSubject('');
  };

  const hrefFieldConfig =
    linkType === 'phone'
      ? {
          label: 'Phone Number *',
          type: 'tel',
          placeholder: '+1-555-123-4567',
        }
      : linkType === 'email'
        ? {
            label: 'Email Address *',
            type: 'email',
            placeholder: 'user@example.com',
          }
        : {
            label: 'URL *',
            type: 'text',
            placeholder: 'https://example.com',
          };

  return (
    <div className="space-y-6">
      <header className="border-b-2 border-teal pb-3">
        <h1 className="text-3xl font-bold text-white">HTML Helpers</h1>
      </header>

      <section className="bg-dark-bg border border-gray-700 rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Link Builder</h2>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleLinkTypeChange('standard')}
            className={`px-4 py-2 rounded transition-colors ${
              linkType === 'standard'
                ? 'bg-teal text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Standard Link
          </button>
          <button
            type="button"
            onClick={() => handleLinkTypeChange('phone')}
            className={`px-4 py-2 rounded transition-colors ${
              linkType === 'phone'
                ? 'bg-teal text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Phone Number
          </button>
          <button
            type="button"
            onClick={() => handleLinkTypeChange('email')}
            className={`px-4 py-2 rounded transition-colors ${
              linkType === 'email'
                ? 'bg-teal text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Email
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
          <div className="bg-dark-surface border border-gray-700 rounded-lg p-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Anchor Text *</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Enter link text"
                value={anchorText}
                onChange={(event) => setAnchorText(event.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">{hrefFieldConfig.label}</label>
              <input
                type={hrefFieldConfig.type}
                className={inputClass}
                placeholder={hrefFieldConfig.placeholder}
                value={href}
                onChange={(event) => setHref(event.target.value)}
              />
            </div>

            {linkType === 'email' && (
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Subject (optional)</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Email subject line"
                  value={emailSubject}
                  onChange={(event) => setEmailSubject(event.target.value)}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Target</label>
              <select
                className={inputClass}
                value={newTab ? '_blank' : ''}
                onChange={(event) => setNewTab(event.target.value === '_blank')}
              >
                <option value="">Same Tab</option>
                <option value="_blank">New Tab</option>
              </select>
            </div>
          </div>

          <div className="bg-dark-surface border border-gray-700 rounded-lg p-4 space-y-4">
            <p className="text-sm font-medium text-gray-300 mb-2">Data Attributes</p>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="inline-flex items-center rounded bg-teal/20 px-2 py-1 text-xs font-medium text-teal">
                Auto
              </span>
              <span>data-automation-group="link" (always included)</span>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-teal"
                  checked={enableLinktype}
                  onChange={(event) => setEnableLinktype(event.target.checked)}
                />
                Add data-linktype
              </label>
              {enableLinktype && (
                <input
                  type="text"
                  className={`${inputClass} mt-2`}
                  placeholder="e.g. cta-banner"
                  value={linktypeValue}
                  onChange={(event) => setLinktypeValue(event.target.value)}
                />
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-teal"
                  checked={enableLinkdetail}
                  onChange={(event) => setEnableLinkdetail(event.target.checked)}
                />
                Add data-linkdetail
              </label>
              {enableLinkdetail && (
                <div className="text-xs text-gray-400 mt-1 bg-dark-bg rounded px-3 py-2">
                  Value: "{anchorText} embed" (auto-generated)
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-teal"
                  checked={enableAutomationId}
                  onChange={(event) => setEnableAutomationId(event.target.checked)}
                />
                Add data-automation-id
              </label>
              {enableAutomationId && (
                <input
                  type="text"
                  className={`${inputClass} mt-2`}
                  placeholder="e.g. hero-cta"
                  value={automationIdValue}
                  onChange={(event) => setAutomationIdValue(event.target.value)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
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