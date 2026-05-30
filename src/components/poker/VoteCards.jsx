export default function VoteCards({ values, selectedValue, onVote, disabled = false }) {
  return (
    <div className="flex flex-wrap gap-3">
      {values.map((value) => {
        const isSelected = selectedValue === value;

        return (
          <button
            key={String(value)}
            type="button"
            onClick={() => onVote(value)}
            disabled={disabled}
            className={`min-w-[60px] h-[80px] rounded-lg border font-bold text-lg transition-colors flex items-center justify-center ${
              isSelected ? 'bg-teal border-teal text-white' : 'bg-bg-primary border-border-light text-text-primary'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-teal'}`}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}
