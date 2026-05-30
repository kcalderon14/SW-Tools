import { useEffect, useState } from 'react';

export default function CreateSessionModal({ isOpen, onClose, onSessionCreated }) {
  const [teamName, setTeamName] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTeamName('');
      setUserName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isDisabled = !teamName.trim() || !userName.trim();

  const handleCreate = () => {
    if (isDisabled) return;

    onSessionCreated({
      teamName: teamName.trim(),
      userName: userName.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-bg-surface rounded-lg p-6 w-[400px] max-w-[90vw]"
        onClick={(event) => event.stopPropagation()}
      >
        <h4 className="text-lg font-semibold text-text-primary mb-4">Create a New Session</h4>

        <div className="space-y-4">
          <div>
            <label htmlFor="team-name" className="text-sm font-medium text-text-secondary mb-1 block">
              Team Name
            </label>
            <input
              id="team-name"
              type="text"
              className="bg-bg-primary text-text-primary border border-border-light rounded px-3 py-2 w-full focus:border-teal focus:outline-none"
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="user-name" className="text-sm font-medium text-text-secondary mb-1 block">
              Your Name (you&apos;ll be the PM)
            </label>
            <input
              id="user-name"
              type="text"
              className="bg-bg-primary text-text-primary border border-border-light rounded px-3 py-2 w-full focus:border-teal focus:outline-none"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="bg-teal hover:bg-teal-hover text-white font-bold px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={handleCreate}
              disabled={isDisabled}
            >
              Create Session
            </button>
            <button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
