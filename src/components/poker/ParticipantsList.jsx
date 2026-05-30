function StatusCheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-400" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.414 0l-3.2-3.2a1 1 0 011.414-1.42l2.493 2.494 6.493-6.494a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const roleBadgeClass = {
  PM: 'bg-teal/20 text-teal border border-teal/40',
  DEV: 'bg-blue-500/20 text-blue-300 border border-blue-400/40',
  QA: 'bg-purple-500/20 text-purple-300 border border-purple-400/40',
};

const hasVoted = (participantId, votes) => {
  return votes && Object.prototype.hasOwnProperty.call(votes, participantId);
};

export default function ParticipantsList({ participants = [], votes = {}, isRevealed }) {
  return (
    <section className="bg-bg-surface rounded-lg p-4">
      <h3 className="text-lg font-bold text-text-primary mb-3">Participants</h3>

      {participants.length === 0 ? (
        <p className="text-text-muted text-sm">No participants yet</p>
      ) : (
        <ul className="space-y-2">
          {participants.map((participant) => {
            const voted = hasVoted(participant.name, votes);
            const voteValue = votes[participant.name];

            return (
              <li
                key={participant.name}
                className="bg-bg-primary border border-border rounded p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-text-primary truncate">{participant.name}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        roleBadgeClass[participant.role] || 'bg-bg-primary text-gray-200'
                      }`}
                    >
                      {participant.role}
                    </span>
                  </div>

                  {isRevealed && voted && (
                    <p className="text-sm text-text-secondary mt-1">Vote: {voteValue}</p>
                  )}
                </div>

                <div className="shrink-0">
                  {voted ? (
                    <StatusCheckIcon />
                  ) : (
                    <span className="text-sm text-text-muted">Waiting...</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
