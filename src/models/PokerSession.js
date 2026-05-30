import { DEFAULT_VOTE_VALUES, ESTIMATION_MODES, ROLES, ROUND_STATES } from '../config/pokerConfig';

export function createSession({ teamName, pmName, sessionId }) {
  return {
    id: sessionId,
    teamName,
    pm: pmName,
    participants: [{ name: pmName, role: ROLES.PM }],
    estimationMode: ESTIMATION_MODES.STORY_POINTS,
    voteValues: DEFAULT_VOTE_VALUES,
    currentRound: {
      votes: {},
      regressionFlags: {},
      state: ROUND_STATES.VOTING,
    },
    roundHistory: [],
    createdAt: new Date().toISOString(),
  };
}
