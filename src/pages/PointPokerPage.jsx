import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateSessionModal from '../components/poker/CreateSessionModal';
import { createSession } from '../models/PokerSession';
import { generateSessionId } from '../utils/pokerSession';

function userStorageKey(sessionId) {
  return `poker-user-${sessionId}`;
}

export default function PointPokerPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'WEBDEV Poker';
  }, []);

  const handleSessionCreated = async ({ teamName, userName }) => {
    const sessionId = generateSessionId();
    const session = createSession({
      teamName,
      pmName: userName,
      sessionId,
    });

    await fetch('/api/poker/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });
    localStorage.setItem(userStorageKey(sessionId), userName);

    setIsCreateModalOpen(false);
    navigate(`/Point-Poker/${sessionId}`);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-3xl text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-bg-surface border border-teal/40 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="w-10 h-10 text-teal"
            aria-hidden="true"
          >
            <rect x="5" y="7" width="10" height="13" rx="1.5" />
            <rect x="9" y="4" width="10" height="13" rx="1.5" />
            <path d="M14 10.5c0-1.2-2-2.6-2-2.6s-2 1.4-2 2.6a2 2 0 0 0 4 0z" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-text-primary">WEBDEV Poker</h1>

        <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
          A free planning poker tool created for all WEBDEV teams. Estimate story points
          collaboratively with your team in real-time.
        </p>

        <button
          type="button"
          className="bg-teal hover:bg-teal-hover text-white font-bold rounded px-8 py-3 transition-colors"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create a WebDev Point Poker Session
        </button>
      </div>

      <CreateSessionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSessionCreated={handleSessionCreated}
      />
    </div>
  );
}
