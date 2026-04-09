export default function CategoryGroup({ subtitle, options, checkedValues, onToggle, onSetAll }) {
  const allChecked = options.length > 0 && options.every((opt) => checkedValues.has(opt));

  const handleToggleAll = () => {
    if (onSetAll) {
      onSetAll(allChecked ? [] : options);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        {subtitle ? <h4 className="text-sm font-semibold text-gray-200">{subtitle}</h4> : <span />}
        {onSetAll ? (
          <button
            type="button"
            onClick={handleToggleAll}
            className="text-xs text-teal hover:text-teal-hover transition-colors"
          >
            {allChecked ? 'Deselect All' : 'Select All'}
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              className="accent-teal"
              checked={checkedValues.has(option)}
              onChange={() => onToggle(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
