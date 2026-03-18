import { formatFromUrls, formatToUrls } from '../utils/urlFormatter';

export default function UrlTextareas({ fromUrls, toUrls, domain, onFromChange, onToChange, onOpenLocModal }) {
  const textareaClass = 'bg-dark-surface text-white border border-gray-600 rounded px-3 py-2 w-full font-mono text-sm focus:border-teal focus:outline-none resize-none';

  const getRows = (text) => Math.max(10, text.split('\n').length);

  const handleFromBlur = () => {
    if (fromUrls.trim()) {
      onFromChange(formatFromUrls(fromUrls));
    }
  };

  const handleToBlur = () => {
    if (toUrls.trim()) {
      onToChange(formatToUrls(toUrls, domain));
    }
  };

  const InfoIcon = ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="ml-2 text-gray-400 hover:text-teal transition-colors"
      title="Generate localized versions"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    </button>
  );

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center mb-1">
          <label className="text-sm font-medium text-gray-300">From</label>
          <InfoIcon onClick={() => onOpenLocModal('from')} />
        </div>
        <textarea
          className={textareaClass}
          rows={getRows(fromUrls)}
          placeholder="From"
          value={fromUrls}
          onChange={(e) => onFromChange(e.target.value)}
          onBlur={handleFromBlur}
        />
      </div>
      <div>
        <div className="flex items-center mb-1">
          <label className="text-sm font-medium text-gray-300">To</label>
          <InfoIcon onClick={() => onOpenLocModal('to')} />
        </div>
        <textarea
          className={textareaClass}
          rows={getRows(toUrls)}
          placeholder="To"
          value={toUrls}
          onChange={(e) => onToChange(e.target.value)}
          onBlur={handleToBlur}
        />
      </div>
    </div>
  );
}
