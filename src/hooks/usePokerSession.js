import { useState, useEffect, useCallback, useRef } from 'react';
import { createSession as createSessionModel } from '../models/PokerSession';
import { generateSessionId } from '../utils/pokerSession';
import { DEFAULT_VOTE_VALUES, HOURS_VOTE_VALUES, ESTIMATION_MODES } from '../config/pokerConfig';

const USER_KEY_PREFIX = 'poker-user-';

function getUserKey(sessionId) {
  return USER_KEY_PREFIX + sessionId;
}

async function fetchSession(sessionId) {
  try {
    const res = await fetch(`/api/poker/session/${sessionId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function persistSession(session) {
  try {
    await fetch('/api/poker/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });
  } catch (e) {
    console.error('Failed to persist session:', e);
  }
}

export function usePokerSession(sessionId) {
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    if (!sessionId) return null;
    return localStorage.getItem(getUserKey(sessionId));
  });
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);

  // Load session from API on mount and poll for updates
  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const load = async () => {
      const data = await fetchSession(sessionId);
      if (mounted) {
        setSession(data);
        setLoading(false);
      }
    };

    load();

    // Poll every 2 seconds for updates from other users
    pollRef.current = setInterval(async () => {
      const data = await fetchSession(sessionId);
      if (mounted && data) {
        setSession(data);
      }
    }, 2000);

    return () => {
      mounted = false;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [sessionId]);

  const isPM = session ? currentUser === session.pm : false;

  const createNewSession = useCallback((teamName, userName) => {
    const id = sessionId || generateSessionId();
    const newSession = createSessionModel({ teamName, pmName: userName, sessionId: id });
    setSession(newSession);
    setCurrentUser(userName);
    localStorage.setItem(getUserKey(id), userName);
    persistSession(newSession);
    return newSession;
  }, [sessionId]);

  const joinSession = useCallback(async (userName, role) => {
    if (!session) return;
    const existingParticipant = session.participants.find(p => p.name === userName);
    let updated;
    if (existingParticipant) {
      updated = { ...session };
    } else {
      updated = {
        ...session,
        participants: [...session.participants, { name: userName, role }],
      };
    }
    setSession(updated);
    setCurrentUser(userName);
    localStorage.setItem(getUserKey(session.id), userName);
    await persistSession(updated);
  }, [session]);

  const castVote = useCallback(async (value, regressionFlag) => {
    if (!session || !currentUser) return;
    const updated = {
      ...session,
      currentRound: {
        ...session.currentRound,
        votes: { ...session.currentRound.votes, [currentUser]: value },
        regressionFlags: regressionFlag !== undefined
          ? { ...session.currentRound.regressionFlags, [currentUser]: regressionFlag }
          : session.currentRound.regressionFlags,
      },
    };
    setSession(updated);
    await persistSession(updated);
  }, [session, currentUser]);

  const revealVotes = useCallback(async () => {
    if (!session) return;
    const updated = {
      ...session,
      currentRound: { ...session.currentRound, state: 'revealed' },
    };
    setSession(updated);
    await persistSession(updated);
  }, [session]);

  const resetVotes = useCallback(async () => {
    if (!session) return;
    const updated = {
      ...session,
      currentRound: { votes: {}, regressionFlags: {}, state: 'voting' },
    };
    setSession(updated);
    await persistSession(updated);
  }, [session]);

  const nextRound = useCallback(async () => {
    if (!session) return;
    const updated = {
      ...session,
      roundHistory: [...session.roundHistory, session.currentRound],
      currentRound: { votes: {}, regressionFlags: {}, state: 'voting' },
    };
    setSession(updated);
    await persistSession(updated);
  }, [session]);

  const setVoteValues = useCallback(async (values) => {
    if (!session) return;
    const updated = { ...session, voteValues: values };
    setSession(updated);
    await persistSession(updated);
  }, [session]);

  const setEstimationMode = useCallback(async (mode) => {
    if (!session) return;

    const nextVoteValues = mode === ESTIMATION_MODES.HOURS
      ? HOURS_VOTE_VALUES
      : DEFAULT_VOTE_VALUES;

    const updated = {
      ...session,
      estimationMode: mode,
      voteValues: nextVoteValues,
      currentRound: {
        ...session.currentRound,
        votes: {},
        regressionFlags: {},
        state: 'voting',
      },
    };

    setSession(updated);
    await persistSession(updated);
  }, [session]);

  return {
    session,
    currentUser,
    setCurrentUser,
    loading,
    createSession: createNewSession,
    joinSession,
    castVote,
    revealVotes,
    resetVotes,
    nextRound,
    setVoteValues,
    setEstimationMode,
    isPM,
  };
}
