const getVoteLabel = (participantId, votes) => {
  if (votes && Object.prototype.hasOwnProperty.call(votes, participantId)) {
    return votes[participantId];
  }

  return null;
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-400" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.414 0l-3.2-3.2a1 1 0 011.414-1.42l2.493 2.494 6.493-6.494a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-400" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M5.293 5.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 111.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function VoteRow({ participant, vote, showRegression, regressionFlags }) {
  return (
    <li className="border border-border rounded p-3 bg-bg-primary">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-text-primary">{participant.name}</p>
        <p className="text-sm text-text-secondary">
          {vote === null ? 'Did not vote' : `Vote: ${vote}`}
        </p>
      </div>

      {showRegression && (
        <div className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
          {regressionFlags?.[participant.name] ? <CheckIcon /> : <XIcon />}
          <span>Regression: {regressionFlags?.[participant.name] ? 'Yes' : 'No'}</span>
        </div>
      )}
    </li>
  );
}

function RoleSection({ title, participants, votes, showRegression, regressionFlags }) {
  return (
    <section className="bg-bg-surface rounded-lg p-4">
      <h3 className="text-lg font-bold text-text-primary mb-3">{title}</h3>

      {participants.length === 0 ? (
        <p className="text-text-muted text-sm">No participants</p>
      ) : (
        <ul className="space-y-2">
          {participants.map((participant) => (
            <VoteRow
              key={participant.name}
              participant={participant}
              vote={getVoteLabel(participant.name, votes)}
              showRegression={showRegression}
              regressionFlags={regressionFlags}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default function VoteResults({ participants = [], votes = {}, regressionFlags = {} }) {
  const qaParticipants = participants.filter((participant) => participant.role === 'QA');
  const devParticipants = participants.filter((participant) => participant.role === 'DEV');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <RoleSection
        title="QA Votes"
        participants={qaParticipants}
        votes={votes}
        showRegression
        regressionFlags={regressionFlags}
      />

      <RoleSection
        title="DEV Votes"
        participants={devParticipants}
        votes={votes}
        showRegression={false}
        regressionFlags={regressionFlags}
      />
    </div>
  );
}
