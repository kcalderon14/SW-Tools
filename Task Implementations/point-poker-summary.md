# Point Poker Feature — Implementation Summary

## Branch: ThePointerPoker

## Overview
A free planning poker tool for WEBDEV teams to estimate story points or time collaboratively. Available at `/Point-Poker`.

## Feature Description
- **PM creates a session** with a team name and their name
- **Shareable URL** allows team members to join from any browser/device
- **Roles**: PM (session creator/leader), QA, DEV
- **PM does NOT vote** — they lead the meeting and control the session
- **Estimation Modes**: PM can toggle between Story Points and Hours
- **Custom Vote Values**: PM can customize vote values or reset to defaults
- **Voting**: QA and DEV roles can vote using configurable point values
- **QA Regression Check**: In Story Points mode, after voting, QA members are asked if the task requires regression test updates (skipped in Hours mode)
- **Vote Reveal**: PM controls when votes are shown, displayed in two sections (QA / DEV)
- **Consensus Celebration**: When all DEVs vote the same value, a random celebratory GIF is shown via Giphy embed
- **Round Management**: PM can reset votes or proceed to next round

## Estimation Modes
| Mode | Default Values | Regression Modal |
|------|---------------|-----------------|
| Story Points | 0, 0.5, 1, 2, 3, 4, 5, 8, ? | Yes (QA only) |
| Hours | 30min, 1h, 1.5h, 2h, 2.5h, 3h, ? | No |

## Architecture

### Routes
| Path | Component | Description |
|------|-----------|-------------|
| `/Point-Poker` | PointPokerPage | Welcome/landing page with session creation |
| `/Point-Poker/:sessionId` | PointPokerSessionPage | Active session view |

### API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/poker/session/:id` | Fetch a session by ID |
| POST | `/api/poker/session` | Create or update a session |

### File Structure
```
server/
├── pokerStore.js              # In-memory session store (dev)
├── vitePlugin.js              # Poker API middleware (dev server)
api/
├── poker-session.js           # Vercel serverless function (production)
src/
├── config/
│   └── pokerConfig.js         # Vote values, roles, round states, estimation modes
├── models/
│   └── PokerSession.js        # Session data factory
├── utils/
│   └── pokerSession.js        # Session ID generation, URL builder, storage key
├── hooks/
│   └── usePokerSession.js     # Core session state management hook (API-backed)
├── pages/
│   ├── PointPokerPage.jsx     # Landing page with CTA
│   └── PointPokerSessionPage.jsx # Session orchestrator page
├── components/
│   └── poker/
│       ├── CreateSessionModal.jsx  # Modal for creating a new session
│       ├── JoinSessionView.jsx     # Join form for new participants
│       ├── VoteCards.jsx           # Clickable vote value cards
│       ├── RegressionModal.jsx     # QA regression confirmation
│       ├── PMControls.jsx          # PM controls (reveal/reset/next/mode/custom values)
│       ├── VoteResults.jsx         # Revealed votes split by QA/DEV
│       ├── ParticipantsList.jsx    # Participant list with status
│       └── ShareSession.jsx        # Shareable URL with copy button
```

### Data Flow
1. PM creates session → stored on server via POST `/api/poker/session`
2. Session URL shared → participants join via URL, pick role (QA/DEV)
3. Participants vote → votes stored in session's currentRound on server
4. PM reveals → vote display unlocked for all (polled every 2s)
5. PM starts next round → current round archived, fresh round begins

### State Management
- **Server-side in-memory store** for session data (shared across all browsers)
- **Polling every 2 seconds** for cross-browser sync
- **Per-user identity** stored in localStorage as `poker-user-{sessionId}`
- **Vercel serverless function** for production deployment

### Roles & Permissions
| Role | Can Vote | Can Reveal | Can Reset | Can Next Round | Mode Toggle | Custom Values | Regression Modal |
|------|----------|------------|-----------|----------------|-------------|---------------|-----------------|
| PM   | No       | Yes        | Yes       | Yes            | Yes         | Yes           | N/A             |
| QA   | Yes      | No         | No        | No             | No          | No            | Story Points only |
| DEV  | Yes      | No         | No        | No             | No          | No            | No              |

### Consensus Detection
- Triggers when ALL DEV participants who voted have the same value
- Requires at least 2 DEVs who voted
- Shows a random Giphy embed iframe from 10 pre-configured celebration GIFs
- New random GIF selected each time votes are revealed

## Tech Stack
- React (functional components + hooks)
- React Router DOM (route params)
- Tailwind CSS (semantic theme tokens — dark/light mode)
- Express/Vite plugin (dev API server)
- Vercel Serverless Functions (production API)
- Giphy Embeds (consensus celebration)

## Known Limitations
- Server-side store is in-memory (resets on server restart/cold start)
- Polling-based sync (2s delay, not true real-time)
- No session expiry — sessions persist until server restarts
- Vercel serverless functions don't share memory across instances

## Future Enhancements
- WebSocket or Firebase integration for true real-time sync
- Persistent database (Redis, Supabase, or similar)
- Session history / past round review
- PM role transfer
- Session expiry and cleanup
- Vote analytics and averages
- Timer for voting rounds

## Updates Log
| Date | Change | Files Affected |
|------|--------|----------------|
| 2026-05-29 | Initial implementation of Point Poker feature | All poker files |
| 2026-05-29 | Migrated from localStorage to server-side API storage | usePokerSession.js, PointPokerPage.jsx, server/pokerStore.js, server/vitePlugin.js, api/poker-session.js |
| 2026-05-29 | Fixed participant vote lookup (participant.id → participant.name) | ParticipantsList.jsx, VoteResults.jsx |
| 2026-05-29 | PM no longer votes, added estimation mode toggle (Story Points / Hours) | PMControls.jsx, PointPokerSessionPage.jsx, pokerConfig.js, PokerSession.js, usePokerSession.js |
| 2026-05-29 | Added custom vote values editor for PM | PMControls.jsx, PointPokerSessionPage.jsx |
| 2026-05-29 | Added consensus detection with Giphy celebration GIFs | PointPokerSessionPage.jsx |
| 2026-05-29 | App-wide light/dark theme system with semantic tokens | index.css, Layout.jsx, Sidebar.jsx, Footer.jsx, all components |
| 2026-05-29 | Removed Dashboard and Settings from sidebar | Sidebar.jsx |
