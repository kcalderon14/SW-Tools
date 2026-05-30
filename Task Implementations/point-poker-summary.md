# Point Poker Feature — Implementation Summary

## Branch: ThePointerPoker

## Overview
A free planning poker tool for WEBDEV teams to estimate story points collaboratively. Available at `/Point-Poker`.

## Feature Description
- **PM creates a session** with a team name and their name
- **Shareable URL** allows team members to join
- **Roles**: PM (session creator), QA, DEV
- **Voting**: All roles can vote using configurable point values
- **QA Regression Check**: After voting, QA members are asked if the task requires regression test updates
- **Vote Reveal**: PM controls when votes are shown, displayed in two sections (QA / DEV)
- **Round Management**: PM can reset votes or proceed to next round

## Default Vote Values
`0, 0.5, 1, 2, 3, 4, 5, 8, ?`

## Architecture

### Routes
| Path | Component | Description |
|------|-----------|-------------|
| `/Point-Poker` | PointPokerPage | Welcome/landing page with session creation |
| `/Point-Poker/:sessionId` | PointPokerSessionPage | Active session view |

### File Structure
```
src/
├── config/
│   └── pokerConfig.js          # Vote values, roles, round states
├── models/
│   └── PokerSession.js         # Session data factory
├── utils/
│   └── pokerSession.js         # Session ID generation, URL builder, storage key
├── hooks/
│   └── usePokerSession.js      # Core session state management hook
├── pages/
│   ├── PointPokerPage.jsx      # Landing page with CTA
│   └── PointPokerSessionPage.jsx # Session orchestrator page
├── components/
│   └── poker/
│       ├── CreateSessionModal.jsx  # Modal for creating a new session
│       ├── JoinSessionView.jsx     # Join form for new participants
│       ├── VoteCards.jsx           # Clickable vote value cards
│       ├── RegressionModal.jsx     # QA regression confirmation
│       ├── PMControls.jsx          # PM action buttons (reveal/reset/next)
│       ├── VoteResults.jsx         # Revealed votes split by QA/DEV
│       ├── ParticipantsList.jsx    # Participant list with status
│       └── ShareSession.jsx        # Shareable URL with copy button
```

### Data Flow
1. PM creates session → stored in localStorage keyed by session ID
2. Session URL shared → participants join via URL, pick role
3. Participants vote → votes stored in session's currentRound
4. PM reveals → vote display unlocked for all
5. PM starts next round → current round archived, fresh round begins

### State Management
- **localStorage** used for persistence (keyed by `poker-session-{sessionId}`)
- **Cross-tab sync** via `storage` event listener
- **Per-user identity** stored as `poker-user-{sessionId}`

### Roles & Permissions
| Role | Can Vote | Can Reveal | Can Reset | Can Next Round | Regression Modal |
|------|----------|------------|-----------|----------------|-----------------|
| PM   | Yes      | Yes        | Yes       | Yes            | No              |
| QA   | Yes      | No         | No        | No             | Yes             |
| DEV  | Yes      | No         | No        | No             | No              |

## Tech Stack
- React (functional components + hooks)
- React Router DOM (route params)
- Tailwind CSS (dark theme)
- localStorage (no backend required)

## Known Limitations
- Multi-user sync is limited to same-browser tabs (localStorage events)
- True real-time across different machines requires a backend (WebSocket/Firebase)
- No session expiry — sessions persist in localStorage until manually cleared

## Future Enhancements
- WebSocket or Firebase integration for real-time multi-user sync
- Session history / past round review
- PM role transfer
- Session expiry and cleanup
- Vote analytics and averages
- Timer for voting rounds

## Updates Log
| Date | Change | Files Affected |
|------|--------|----------------|
| 2026-05-29 | Initial implementation of Point Poker feature | All files listed above |
