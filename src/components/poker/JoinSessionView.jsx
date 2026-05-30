import { useState } from 'react';

export default function JoinSessionView({ onJoin }) {
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');

  const canJoin = userName.trim().length > 0 && role;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canJoin) return;

    onJoin({
      userName: userName.trim(),
      role,
    });
  };

  const roleButtonClass = (value) => {
    const isSelected = role === value;

    if (isSelected) {
      return 'bg-teal border-teal text-white';
    }

    return 'bg-bg-primary border-border-light text-text-secondary hover:border-teal';
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-bg-surface rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-text-primary mb-5">Join Session</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-text-secondary mb-1" htmlFor="join-user-name">
              Your Name
            </label>
            <input
              id="join-user-name"
              type="text"
              required
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              className="w-full bg-bg-primary border border-border-light rounded px-3 py-2 text-text-primary focus:border-teal focus:outline-none"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <p className="text-sm text-text-secondary mb-2">Role</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole('QA')}
                className={`px-4 py-2 rounded border font-semibold transition-colors ${roleButtonClass('QA')}`}
              >
                QA
              </button>
              <button
                type="button"
                onClick={() => setRole('DEV')}
                className={`px-4 py-2 rounded border font-semibold transition-colors ${roleButtonClass('DEV')}`}
              >
                DEV
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!canJoin}
            className="w-full bg-teal hover:bg-teal-hover text-white font-bold px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
