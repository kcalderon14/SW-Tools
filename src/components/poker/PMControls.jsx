import { useState } from 'react';

export default function PMControls({
  estimationMode,
  onModeChange,
  currentValues,
  onSetValues,
  onReveal,
  onReset,
  onNextRound,
  votesCount,
  isRevealed,
}) {
  const [isEditingValues, setIsEditingValues] = useState(false);
  const [valuesInput, setValuesInput] = useState((currentValues || []).join(', '));

  const revealDisabled = votesCount === 0 || isRevealed;
  const storyPointsActive = estimationMode !== 'hours';

  const handleSaveValues = () => {
    const parsedValues = valuesInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const numericValue = Number(item);
        return Number.isNaN(numericValue) ? item : numericValue;
      });

    onSetValues(parsedValues);
    setIsEditingValues(false);
  };

  const handleStartEditing = () => {
    setValuesInput((currentValues || []).join(', '));
    setIsEditingValues(true);
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
          <div className="space-y-2">
            <input
              type="text"
              value={valuesInput}
              onChange={(event) => setValuesInput(event.target.value)}
              className="bg-bg-primary text-text-primary border border-border-light rounded px-3 py-2 w-full focus:border-teal focus:outline-none"
            />

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
                onClick={() => onSetValues(null)}
                className="text-white text-sm font-bold px-3 py-1 rounded transition-colors bg-gray-600 hover:bg-gray-700"
              >
                Reset to Default
              </button>
              <button
                type="button"
                onClick={() => setIsEditingValues(false)}
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

        <button
          type="button"
          onClick={onReset}
          className="text-white font-bold px-4 py-2 rounded transition-colors bg-red-600 hover:bg-red-700"
        >
          Reset Votes
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
