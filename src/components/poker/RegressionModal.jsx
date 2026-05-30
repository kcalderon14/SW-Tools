export default function RegressionModal({ isOpen, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-bg-surface rounded-lg p-6 w-[400px] max-w-[92vw]">
        <h3 className="text-xl font-bold text-text-primary mb-2">Regression Update Required?</h3>
        <p className="text-text-secondary mb-5">Does this task require updating regression tests?</p>

        <div className="flex gap-3">
          <button
            type="button"
            className="bg-teal hover:bg-teal-hover text-white font-bold px-4 py-2 rounded transition-colors"
            onClick={() => onConfirm(true)}
          >
            Yes
          </button>
          <button
            type="button"
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-4 py-2 rounded transition-colors"
            onClick={() => onConfirm(false)}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
