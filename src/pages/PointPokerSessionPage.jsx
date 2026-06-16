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
  { src: '/gifs/celebrate-1.gif', message: 'Perfect sync!' },
  { src: '/gifs/celebrate-2.gif', message: 'Teamwork makes the dream work!' },
  { src: '/gifs/celebrate-3.gif', message: 'Nailed it!' },
  { src: '/gifs/celebrate-4.gif', message: 'Houston, we have consensus!' },
  { src: '/gifs/celebrate-5.gif', message: 'Everyone agrees!' },
  { src: '/gifs/celebrate-6.gif', message: 'High five, team!' },
  { src: '/gifs/celebrate-7.gif', message: 'Celebration time!' },
  { src: '/gifs/celebrate-8.gif', message: 'The team is on fire!' },
  { src: '/gifs/celebrate-9.gif', message: 'Flawless alignment!' },
  { src: '/gifs/celebrate-10.gif', message: 'Great minds think alike!' },
];

function getRandomGif() {
  return CONSENSUS_GIFS[Math.floor(Math.random() * CONSENSUS_GIFS.length)];
}

function checkConsensus(participants, votes) {
  const devVotes = participants
    .filter((p) => p.role === 'DEV' && votes[p.name] !== undefined)
    .map((p) => votes[p.name])
    .filter((vote) => vote !== '☕');

  const qaVotes = participants
    .filter((p) => p.role === 'QA' && votes[p.name] !== undefined)
    .map((p) => votes[p.name])
    .filter((vote) => vote !== '☕');

  const hasEnoughDevVoters = devVotes.length >= 2;
  const hasEnoughQaVoters = qaVotes.length >= 2;

  const devConsensus = !hasEnoughDevVoters || devVotes.every((vote) => vote === devVotes[0]);
  const qaConsensus = !hasEnoughQaVoters || qaVotes.every((vote) => vote === qaVotes[0]);

  return (hasEnoughDevVoters || hasEnoughQaVoters) && devConsensus && qaConsensus;
}

export default function PointPokerSessionPage() {
  const { sessionId = '' } = useParams();
  const navigate = useNavigate();

  const {
    session,
    currentUser,
    setCurrentUser,
    loading,
    createSession,
    joinSession,
    castVote,
    revealVotes,
    nextRound,
    setVoteValues,
    setEstimationMode,
    kickParticipant,
    isPM,
    isObserver,
    canControl,
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

  useEffect(() => {
    if (session?.currentRound && currentUser) {
      const votes = session.currentRound.votes || {};
      const existingVote = votes[currentUser];
      if (existingVote !== undefined && session.currentRound.state === 'voting') {
        setSelectedVote(existingVote);
      } else if (session.currentRound.state === 'voting') {
        setSelectedVote(null);
      }
    }
  }, [session?.currentRound?.votes, currentUser, session?.currentRound?.state]);

  useEffect(() => {
    if (!session || !currentUser) return;

    const isParticipant = (session.participants || []).some((participant) => participant.name === currentUser);
    if (isParticipant) return;

    localStorage.removeItem(`poker-user-${sessionId}`);
    setCurrentUser(null);
    setSelectedVote(null);
  }, [session, currentUser, sessionId, setCurrentUser]);

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

  const isCurrentUserParticipant = (session.participants || []).some((participant) => participant.name === currentUser);

  if (!currentUser) {
    return <JoinSessionView onJoin={handleJoin} />;
  }

  if (!isCurrentUserParticipant) {
    return <JoinSessionView onJoin={handleJoin} />;
  }

  const currentRound = session.currentRound || { votes: {}, regressionFlags: {}, state: 'voting' };
  const hasVoted = Object.prototype.hasOwnProperty.call(currentRound.votes || {}, currentUser);
  const isRevealed = currentRound.state === 'revealed';
  const hasConsensus = isRevealed && checkConsensus(session.participants, currentRound.votes);

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
            <p className="text-sm text-text-secondary mb-1">
              Welcome, <span className="font-semibold text-text-primary">{currentUser}</span>
            </p>
            <h1 className="text-3xl font-bold text-text-primary">{session.teamName}</h1>
            <p className="text-text-secondary mt-2">
              Round status:{' '}
              <span className="text-teal font-semibold capitalize">{currentRound.state}</span>
            </p>
          </header>

          {canControl && (
            <PMControls
              estimationMode={session.estimationMode}
              onModeChange={setEstimationMode}
              currentValues={session.voteValues}
              onSetValues={handleSetValues}
              onReveal={() => revealVotes()}
              onNextRound={() => {
                nextRound();
                setSelectedVote(null);
              }}
              votesCount={Object.keys(currentRound.votes || {}).length}
              isRevealed={currentRound.state === 'revealed'}
            />
          )}

          {isPM && <ShareSession sessionUrl={buildShareableUrl(sessionId)} />}

          {!isPM && !isObserver && (
            <section className="bg-bg-surface rounded-lg border border-border p-5 space-y-4">
              <h2 className="text-xl font-bold text-text-primary">Cast Your Vote</h2>
              <VoteCards
                values={session.voteValues}
                selectedValue={selectedVote}
                onVote={handleVote}
                disabled={isRevealed}
              />
              {hasVoted && !isRevealed && (
                <p className="text-sm text-text-secondary">Your vote is in. You can change it until votes are revealed.</p>
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
            canControl={canControl}
            onKick={kickParticipant}
            currentUser={currentUser}
          />
          {hasConsensus && (
            <div className="text-center space-y-3 bg-bg-surface rounded-lg border border-teal/40 p-4">
              <h3 className="text-xl font-bold text-teal">🎉 Consensus!</h3>
              <p className="text-text-secondary text-sm">{consensusGif.message}</p>
              <img
                src={consensusGif.src}
                alt="Celebration GIF"
                className="w-full rounded-lg"
                loading="lazy"
              />
            </div>
          )}
        </aside>
      </div>

      <RegressionModal isOpen={showRegressionModal} onConfirm={handleRegressionConfirm} />
    </div>
  );
}
