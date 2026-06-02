const getVoteLabel = (participantId, votes) => {
  if (votes && Object.prototype.hasOwnProperty.call(votes, participantId)) {
    return votes[participantId];
  }

  return null;
};

const formatVote = (vote) => {
  if (vote === '☕') {
    return '☕ Skipped';
  }

  return vote;
};

const CHART_COLORS = ['#14b8a6', '#3b82f6', '#a855f7', '#f59e0b', '#22c55e', '#ef4444', '#ec4899', '#06b6d4', '#84cc16', '#f97316'];

const parseNumericVote = (vote) => {
  if (typeof vote === 'number' && Number.isFinite(vote)) {
    return vote;
  }

  if (typeof vote !== 'string') {
    return null;
  }

  const trimmedVote = vote.trim();
  if (!trimmedVote || !/^-?\d+(\.\d+)?$/.test(trimmedVote)) {
    return null;
  }

  const parsedVote = Number(trimmedVote);
  return Number.isFinite(parsedVote) ? parsedVote : null;
};

const getAverageLabel = (participants, votes) => {
  const numericVotes = participants
    .map((participant) => parseNumericVote(getVoteLabel(participant.name, votes)))
    .filter((vote) => vote !== null);

  if (numericVotes.length === 0) {
    return 'N/A';
  }

  const total = numericVotes.reduce((sum, vote) => sum + vote, 0);
  return (total / numericVotes.length).toFixed(1);
};

const getDistributionLabel = (voteValue) => {
  if (voteValue === '☕') {
    return 'Skipped';
  }

  if (voteValue === '?') {
    return 'Uncertain';
  }

  return voteValue;
};

function polarToCartesian(cx, cy, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function describeArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

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
          {vote === null ? 'Did not vote' : `Vote: ${formatVote(vote)}`}
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
  const averageLabel = getAverageLabel(participants, votes);

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

      <p className="mt-3 text-sm text-text-muted">Average: {averageLabel}</p>
    </section>
  );
}

function VoteDistribution({ entries, totalVotes }) {
  const cx = 80;
  const cy = 80;
  const radius = 70;
  const hasSingleValue = entries.length === 1;
  let currentAngle = 0;

  return (
    <section className="bg-bg-surface rounded-lg p-4 md:col-span-2">
      <h3 className="text-lg font-bold text-text-primary mb-3">Vote Distribution</h3>

      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="mx-auto lg:mx-0 shrink-0">
          <svg viewBox="0 0 160 160" className="w-48 h-48" role="img" aria-label="Vote distribution pie chart">
            {hasSingleValue ? (
              <circle cx={cx} cy={cy} r={radius} fill={entries[0].color} />
            ) : (
              entries.map((entry) => {
                const angle = (entry.count / totalVotes) * 360;
                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;
                currentAngle = endAngle;

                return <path key={`slice-${entry.value}`} d={describeArc(cx, cy, radius, startAngle, endAngle)} fill={entry.color} />;
              })
            )}
          </svg>
        </div>

        <ul className="space-y-2 text-sm text-text-secondary w-full">
          {entries.map((entry) => (
            <li key={`legend-${entry.value}`} className="flex items-center justify-between gap-4 border border-border rounded px-3 py-2 bg-bg-primary">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }} aria-hidden="true" />
                <span className="text-text-primary truncate">{getDistributionLabel(entry.value)}</span>
              </div>
              <span className="text-text-muted">{entry.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function VoteResults({ participants = [], votes = {}, regressionFlags = {} }) {
  const qaParticipants = participants.filter((participant) => participant.role === 'QA');
  const devParticipants = participants.filter((participant) => participant.role === 'DEV');
  const chartParticipants = [...qaParticipants, ...devParticipants];

  const voteCounts = chartParticipants.reduce((acc, participant) => {
    const vote = getVoteLabel(participant.name, votes);
    if (vote === null || vote === undefined) {
      return acc;
    }

    const key = String(vote);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const distributionEntries = Object.entries(voteCounts).map(([value, count], index) => ({
    value,
    count,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  const totalVotes = distributionEntries.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <div className="space-y-4">
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

      {totalVotes > 0 && <VoteDistribution entries={distributionEntries} totalVotes={totalVotes} />}
    </div>
  );
}
