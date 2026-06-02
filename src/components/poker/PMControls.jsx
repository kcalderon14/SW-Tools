import { useState } from 'react';
import { DEFAULT_VOTE_VALUES, HOURS_VOTE_VALUES } from '../../config/pokerConfig';

export default function PMControls({
  estimationMode,
  onModeChange,
  currentValues,
  onSetValues,
  onReveal,
  onNextRound,
  votesCount,
  isRevealed,
}) {
  const [isEditingValues, setIsEditingValues] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [customInput, setCustomInput] = useState('');

  const revealDisabled = votesCount === 0 || isRevealed;
  const storyPointsActive = estimationMode !== 'hours';
  const defaultValues = storyPointsActive ? DEFAULT_VOTE_VALUES : HOURS_VOTE_VALUES;
  const displayedEditValues = [
    ...defaultValues,
    ...selectedValues.filter((value) => !defaultValues.includes(value)),
  ];

  const handleSaveValues = () => {
    onSetValues(selectedValues);
    setCustomInput('');
    setIsEditingValues(false);
  };

  const handleStartEditing = () => {
    setSelectedValues([...(currentValues || [])]);
    setCustomInput('');
    setIsEditingValues(true);
  };

  const handleToggleValue = (value) => {
    setSelectedValues((previousValues) =>
      previousValues.includes(value)
        ? previousValues.filter((item) => item !== value)
        : [...previousValues, value],
    );
  };

  const handleAddCustomValue = () => {
    const trimmedValue = customInput.trim();
    if (!trimmedValue) {
      return;
    }

    const numericValue = Number(trimmedValue);
    const parsedValue = Number.isNaN(numericValue) ? trimmedValue : numericValue;

    setSelectedValues((previousValues) =>
      previousValues.includes(parsedValue) ? previousValues : [...previousValues, parsedValue],
    );
    setCustomInput('');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onModeChange('story_points')}
          className={`font-bold px-4 py-2 rounded transition-colors ${storyPointsActive ? 'bg-teal text-white' : 'bg-bg-primary text-text-secondary border border-border-light'}`}
        >
          Story Points
        </button>
        <button
          type="button"
          onClick={() => onModeChange('hours')}
          className={`font-bold px-4 py-2 rounded transition-colors ${storyPointsActive ? 'bg-bg-primary text-text-secondary border border-border-light' : 'bg-teal text-white'}`}
        >
          Hours
        </button>
      </div>

      <section className="bg-bg-surface border border-border rounded p-3 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-text-primary">Vote Values</h3>
          {!isEditingValues && (
            <button
              type="button"
              onClick={handleStartEditing}
              className="text-sm font-semibold text-teal hover:text-teal-hover transition-colors"
            >
              Customize
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {(currentValues || []).map((value) => (
            <span
              key={String(value)}
              className="px-2 py-1 rounded-full text-xs font-semibold bg-bg-primary border border-border-light text-text-primary"
            >
              {String(value)}
            </span>
          ))}
        </div>

        {isEditingValues && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {displayedEditValues.map((value) => {
                const isSelected = selectedValues.includes(value);

                return (
                  <button
                    key={String(value)}
                    type="button"
                    onClick={() => handleToggleValue(value)}
                    className={`min-w-[50px] h-[50px] px-3 rounded-lg border font-bold transition-colors ${
                      isSelected
                        ? 'bg-teal border-teal text-white'
                        : 'bg-bg-primary border-border-light text-text-muted opacity-50 hover:opacity-80'
                    }`}
                  >
                    {String(value)}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(event) => setCustomInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleAddCustomValue();
                  }
                }}
                placeholder="Add custom value"
                className="bg-bg-primary text-text-primary border border-border-light rounded px-3 py-2 w-full sm:w-auto sm:min-w-[180px] focus:border-teal focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomValue}
                className="text-white text-sm font-bold px-3 py-2 rounded transition-colors bg-teal hover:bg-teal-hover"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSaveValues}
                className="text-white text-sm font-bold px-3 py-1 rounded transition-colors bg-teal hover:bg-teal-hover"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setSelectedValues([...defaultValues])}
                className="text-white text-sm font-bold px-3 py-1 rounded transition-colors bg-gray-600 hover:bg-gray-700"
              >
                Reset to Default
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomInput('');
                  setIsEditingValues(false);
                }}
                className="text-sm font-semibold text-text-muted hover:text-text-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onReveal}
          disabled={revealDisabled}
          className="text-white font-bold px-4 py-2 rounded transition-colors bg-teal hover:bg-teal-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reveal Votes
        </button>

        {isRevealed && (
          <button
            type="button"
            onClick={onNextRound}
            className="text-white font-bold px-4 py-2 rounded transition-colors bg-gray-600 hover:bg-gray-700"
          >
            Next Round
          </button>
        )}
      </div>
    </div>
  );
}
