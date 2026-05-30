import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePokerSession } from '../hooks/usePokerSession';
import { ESTIMATION_MODES, ROLES, DEFAULT_VOTE_VALUES, HOURS_VOTE_VALUES } from '../config/pokerConfig';
import { buildShareableUrl } from '../utils/pokerSession';
import JoinSessionView from '../components/poker/JoinSessionView';
import VoteCards from '../components/poker/VoteCards';
import RegressionModal from '../components/poker/RegressionModal';
import PMControls from '../components/poker/PMControls';
import VoteResults from '../components/poker/VoteResults';
import ParticipantsList from '../components/poker/ParticipantsList';
import ShareSession from '../components/poker/ShareSession';

const CONSENSUS_GIFS = [
  { id: 'dSetNZo2AJfptAk9hp', message: 'Perfect sync!' },
  { id: 'l0HlMSGQQmY0tiere', message: 'Teamwork makes the dream work!' },
  { id: 'kyLYXonQYYfwYDIeZl', message: 'Nailed it!' },
  { id: 'YRVUSmSTGFP848gJT0', message: 'Houston, we have consensus!' },
  { id: 'l0MYGb1LuZ3n7dRnO', message: 'Everyone agrees!' },
  { id: 'g9582DNuQppxC', message: 'High five, team!' },
  { id: 'xT0xezQGU5xCDJuCPe', message: 'Celebration time!' },
  { id: 'Is1O1TWV0LEJi', message: 'The team is on fire!' },
  { id: '11sBLVxNs7v6WA', message: 'Flawless alignment!' },
  { id: 'l0MYJnJQ4EiYLxvQ4', message: 'Great minds think alike!' },
];

function getRandomGif() {
  return CONSENSUS_GIFS[Math.floor(Math.random() * CONSENSUS_GIFS.length)];
}

function checkDevConsensus(participants, votes) {
  const devs = participants.filter((p) => p.role === 'DEV');
  const votedDevs = devs.filter((p) => votes[p.name] !== undefined);
  if (votedDevs.length < 2) return false;
  const firstVote = votes[votedDevs[0].name];
  return votedDevs.every((p) => votes[p.name] === firstVote);
}

export default function PointPokerSessionPage() {
  const { sessionId = '' } = useParams();
  const navigate = useNavigate();

  const {
    session,
    currentUser,
    loading,
    createSession,
    joinSession,
    castVote,
    revealVotes,
    resetVotes,
    nextRound,
    setVoteValues,
    setEstimationMode,
    isPM,
  } = usePokerSession(sessionId);

  const [selectedVote, setSelectedVote] = useState(null);
  const [showRegressionModal, setShowRegressionModal] = useState(false);
  const [pendingVote, setPendingVote] = useState(null);
  const [consensusGif, setConsensusGif] = useState(() => getRandomGif());

  useEffect(() => {
    if (currentUser && session?.teamName) {
      document.title = `WEBDEV Poker - ${session.teamName}`;
    }
  }, [currentUser, session?.teamName]);

  useEffect(() => {
    if (session?.currentRound?.state === 'revealed') {
      setConsensusGif(getRandomGif());
    }
  }, [session?.currentRound?.state]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-text-muted text-lg">Loading session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-bg-surface rounded-lg border border-border p-6 max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold text-text-primary">Session not found</h1>
          <p className="text-text-secondary">This session does not exist or is no longer available.</p>
          <button
            type="button"
            onClick={() => navigate('/Point-Poker')}
            className="inline-flex items-center justify-center bg-teal hover:bg-teal-hover text-white font-bold rounded px-4 py-2 transition-colors"
          >
            Back to Point Poker
          </button>
        </div>
      </div>
    );
  }

  const handleJoin = ({ userName, role }) => {
    joinSession(userName, role);
  };

  if (!currentUser) {
    return <JoinSessionView onJoin={handleJoin} />;
  }

  const currentRound = session.currentRound || { votes: {}, regressionFlags: {}, state: 'voting' };
  const hasVoted = Object.prototype.hasOwnProperty.call(currentRound.votes || {}, currentUser);
  const isRevealed = currentRound.state === 'revealed';
  const devConsensus = isRevealed && checkDevConsensus(session.participants, currentRound.votes);

  const handleVote = (value) => {
    const participant = session.participants.find((item) => item.name === currentUser);
    const role = participant?.role;

    if (role === ROLES.QA && session.estimationMode !== ESTIMATION_MODES.HOURS) {
      setPendingVote(value);
      setShowRegressionModal(true);
      return;
    }

    castVote(value);
    setSelectedVote(value);
  };

  const handleRegressionConfirm = (needsRegression) => {
    if (pendingVote === null) {
      setShowRegressionModal(false);
      return;
    }

    castVote(pendingVote, needsRegression);
    setSelectedVote(pendingVote);
    setPendingVote(null);
    setShowRegressionModal(false);
  };

  const handleSetValues = (values) => {
    if (values === null) {
      setVoteValues(session.estimationMode === 'hours' ? HOURS_VOTE_VALUES : DEFAULT_VOTE_VALUES);
    } else {
      setVoteValues(values);
    }
  };

  return (
    <div className="min-h-[70vh] bg-bg-primary text-text-primary px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row gap-6">
        <main className="flex-1 space-y-6">
          <header className="bg-bg-surface rounded-lg border border-border p-5">
            <h1 className="text-3xl font-bold text-text-primary">{session.teamName}</h1>
            <p className="text-text-secondary mt-2">
              Round status:{' '}
              <span className="text-teal font-semibold capitalize">{currentRound.state}</span>
            </p>
          </header>

          {isPM && (
            <PMControls
              estimationMode={session.estimationMode}
              onModeChange={setEstimationMode}
              currentValues={session.voteValues}
              onSetValues={handleSetValues}
              onReveal={() => revealVotes()}
              onReset={() => {
                resetVotes();
                setSelectedVote(null);
              }}
              onNextRound={() => {
                nextRound();
                setSelectedVote(null);
              }}
              votesCount={Object.keys(currentRound.votes || {}).length}
              isRevealed={currentRound.state === 'revealed'}
            />
          )}

          {isPM && <ShareSession sessionUrl={buildShareableUrl(sessionId)} />}

          {!isPM && (
            <section className="bg-bg-surface rounded-lg border border-border p-5 space-y-4">
              <h2 className="text-xl font-bold text-text-primary">Cast Your Vote</h2>
              <VoteCards
                values={session.voteValues}
                selectedValue={selectedVote}
                onVote={handleVote}
                disabled={isRevealed || hasVoted}
              />
              {hasVoted && !isRevealed && (
                <p className="text-sm text-text-secondary">Your vote is in. Waiting for reveal.</p>
              )}
            </section>
          )}

          {currentRound.state === 'revealed' && (
            <VoteResults
              participants={session.participants}
              votes={currentRound.votes}
              regressionFlags={currentRound.regressionFlags}
            />
          )}
        </main>

        <aside className="w-full lg:w-72 space-y-4">
          <ParticipantsList
            participants={session.participants}
            votes={currentRound.votes}
            isRevealed={currentRound.state === 'revealed'}
          />
          {devConsensus && (
            <div className="text-center space-y-3 bg-bg-surface rounded-lg border border-teal/40 p-4">
              <h3 className="text-xl font-bold text-teal">🎉 Consensus!</h3>
              <p className="text-text-secondary text-sm">{consensusGif.message}</p>
              <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                <iframe
                  src={`https://giphy.com/embed/${consensusGif.id}`}
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  frameBorder="0"
                  allowFullScreen
                  title="Celebration GIF"
                />
              </div>
            </div>
          )}
        </aside>
      </div>

      <RegressionModal isOpen={showRegressionModal} onConfirm={handleRegressionConfirm} />
    </div>
  );
}
