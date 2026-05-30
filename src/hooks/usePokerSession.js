import { useState, useEffect, useCallback } from 'react';
import { ref, set, onValue, off } from 'firebase/database';
import { db } from '../config/firebase';
import { createSession as createSessionModel } from '../models/PokerSession';
import { generateSessionId } from '../utils/pokerSession';
import { DEFAULT_VOTE_VALUES, HOURS_VOTE_VALUES, ESTIMATION_MODES } from '../config/pokerConfig';

const USER_KEY_PREFIX = 'poker-user-';

function getUserKey(sessionId) {
  return USER_KEY_PREFIX + sessionId;
}

function getSessionRef(sessionId) {
  return ref(db, `poker-sessions/${sessionId}`);
}

export function usePokerSession(sessionId) {
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    if (!sessionId) return null;
    return localStorage.getItem(getUserKey(sessionId));
  });
  const [loading, setLoading] = useState(true);

  // Real-time listener for session data
  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const sessionRef = getSessionRef(sessionId);

    onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      setSession(data);
      setLoading(false);
    }, (error) => {
      console.error('Firebase read error:', error);
      setLoading(false);
    });

    return () => {
      off(sessionRef);
    };
  }, [sessionId]);

  const isPM = session ? currentUser === session.pm : false;

  const persistSession = useCallback(async (updatedSession) => {
    if (!updatedSession || !updatedSession.id) return;
    try {
      await set(getSessionRef(updatedSession.id), updatedSession);
    } catch (e) {
      console.error('Firebase write error:', e);
    }
  }, []);

  const createNewSession = useCallback((teamName, userName) => {
    const id = sessionId || generateSessionId();
    const newSession = createSessionModel({ teamName, pmName: userName, sessionId: id });
    setSession(newSession);
    setCurrentUser(userName);
    localStorage.setItem(getUserKey(id), userName);
    persistSession(newSession);
    return newSession;
  }, [sessionId, persistSession]);

  const joinSession = useCallback((userName, role) => {
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
    persistSession(updated);
  }, [session, persistSession]);

  const castVote = useCallback((value, regressionFlag) => {
    if (!session || !currentUser) return;
    const updated = {
      ...session,
      currentRound: {
        ...session.currentRound,
        votes: { ...session.currentRound.votes, [currentUser]: value },
        regressionFlags: regressionFlag !== undefined
          ? { ...(session.currentRound.regressionFlags || {}), [currentUser]: regressionFlag }
          : (session.currentRound.regressionFlags || {}),
      },
    };
    setSession(updated);
    persistSession(updated);
  }, [session, currentUser, persistSession]);

  const revealVotes = useCallback(() => {
    if (!session) return;
    const updated = {
      ...session,
      currentRound: { ...session.currentRound, state: 'revealed' },
    };
    setSession(updated);
    persistSession(updated);
  }, [session, persistSession]);

  const resetVotes = useCallback(() => {
    if (!session) return;
    const updated = {
      ...session,
      currentRound: { votes: {}, regressionFlags: {}, state: 'voting' },
    };
    setSession(updated);
    persistSession(updated);
  }, [session, persistSession]);

  const nextRound = useCallback(() => {
    if (!session) return;
    const updated = {
      ...session,
      roundHistory: [...(session.roundHistory || []), session.currentRound],
      currentRound: { votes: {}, regressionFlags: {}, state: 'voting' },
    };
    setSession(updated);
    persistSession(updated);
  }, [session, persistSession]);

  const setVoteValues = useCallback((values) => {
    if (!session) return;
    const updated = { ...session, voteValues: values };
    setSession(updated);
    persistSession(updated);
  }, [session, persistSession]);

  const setEstimationMode = useCallback((mode) => {
    if (!session) return;
    const newValues = mode === ESTIMATION_MODES.HOURS ? HOURS_VOTE_VALUES : DEFAULT_VOTE_VALUES;
    const updated = {
      ...session,
      estimationMode: mode,
      voteValues: newValues,
      currentRound: { votes: {}, regressionFlags: {}, state: 'voting' },
    };
    setSession(updated);
    persistSession(updated);
  }, [session, persistSession]);

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
