import { useRef } from 'react';
import { sitesData, redirectTypes } from '../config/data';

export default function RedirectForm({ formData, onChange }) {
  const domainRef = useRef(null);

  const handleDescriptionKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      domainRef.current?.focus();
    }
  };

  const inputClass = 'bg-dark-surface text-white border border-gray-600 rounded px-3 py-2 w-full focus:border-teal focus:outline-none';

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-300 mb-1 block">Description</label>
        <input
          type="text"
          className={inputClass}
          placeholder="Description"
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          onKeyDown={handleDescriptionKeyDown}
          onBlur={(e) => onChange('description', e.target.value.trim())}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-300 mb-1 block">Domain</label>
        <select
          ref={domainRef}
          className={inputClass}
          value={formData.domain}
          onChange={(e) => onChange('domain', e.target.value)}
        >
          {sitesData.map((s) => (
            <option key={s.site} value={s.site}>{s.site}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-300 mb-1 block">Redirect Type</label>
        <select
          className={inputClass}
          value={formData.statusCode}
          onChange={(e) => onChange('statusCode', parseInt(e.target.value, 10))}
        >
          {redirectTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <select
          className={inputClass}
          value={formData.queryString}
          onChange={(e) => onChange('queryString', e.target.value)}
        >
          <option value="1">Copy query string</option>
          <option value="">Do not copy query string</option>
        </select>
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.langValidation}
            onChange={(e) => onChange('langValidation', e.target.checked)}
            className="accent-teal"
          />
          Validate Language
        </label>
      </div>
    </div>
  );
}
