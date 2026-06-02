# Point Poker Feature — Implementation Summary

## Branch: ThePointerPoker

## Overview
A free planning poker tool for WEBDEV teams to estimate story points or time collaboratively. Available at `/Point-Poker`.

## Feature Description
- **PM creates a session** with a team name and their name
- **Shareable URL** allows team members to join from any browser/device
- **Roles**: PM (session creator/leader), QA, DEV, Observer (non-voting PM backup)
- **PM does NOT vote** — they lead the meeting and control the session
- **Estimation Modes**: PM can toggle between Story Points and Hours
- **Custom Vote Values**: PM/Observer can visually toggle default values on/off and add extra custom values through a text field
- **Voting**: QA and DEV roles can vote using configurable point values; Observer cannot vote
- **Kick Participant**: PM/Observer can remove participants from the session (kick button on each row); kicked users are returned to the join screen and can rejoin
- **Welcome Message**: Session page shows 'Welcome, {username}' at the top of the header
- **Coffee Vote (☕)**: Participants can choose ☕ to skip a round (treated as abstained)
- **QA Regression Check**: In Story Points mode, after voting, QA members are asked if the task requires regression test updates (skipped in Hours mode)
- **Vote Reveal**: PM controls when votes are shown, displayed in two sections (QA / DEV); after reveal, non-voters show "-" instead of "Waiting..."
- **Vote Averages**: After reveal, QA and DEV sections each display the average of numeric votes (non-numeric values like ?, ☕ are excluded)
- **Vote Distribution Chart**: A pie chart visualizes the combined vote distribution across all DEV and QA participants, with a color-coded legend
- **Consensus Celebration**: When all DEVs vote the same value, a random celebratory message with emojis is displayed
- **Round Management**: PM proceeds to next round (which clears all participant selected values)

## Estimation Modes
| Mode | Default Values | Regression Modal |
|------|---------------|-----------------|
| Story Points | 0, 0.5, 1, 2, 3, 4, 5, 8, ?, ☕ | Yes (QA only) |
| Hours | 30min, 1h, 1.5h, 2h, 2.5h, 3h, ?, ☕ | No |

## Architecture

### Routes
| Path | Component | Description |
|------|-----------|-------------|
| `/Point-Poker` | PointPokerPage | Welcome/landing page with session creation |
| `/Point-Poker/:sessionId` | PointPokerSessionPage | Active session view |

### Backend: Firebase Realtime Database
Sessions are stored in Firebase Realtime Database at path `poker-sessions/{sessionId}`. No custom API endpoints are needed — the Firebase client SDK handles all reads/writes directly from the browser with real-time listeners.

### File Structure
```
src/
├── config/
│   ├── firebase.js            # Firebase app initialization + database export
│   └── pokerConfig.js         # Vote values, roles, round states, estimation modes
├── models/
│   └── PokerSession.js        # Session data factory
├── utils/
│   └── pokerSession.js        # Session ID generation, URL builder
├── hooks/
│   └── usePokerSession.js     # Core session hook (Firebase real-time listener)
├── pages/
│   ├── PointPokerPage.jsx     # Landing page with CTA
│   └── PointPokerSessionPage.jsx # Session orchestrator page
├── components/
│   └── poker/
│       ├── CreateSessionModal.jsx  # Modal for creating a new session
│       ├── JoinSessionView.jsx     # Join form for new participants
│       ├── VoteCards.jsx           # Clickable vote value cards
│       ├── RegressionModal.jsx     # QA regression confirmation
│       ├── PMControls.jsx          # PM controls (reveal/next/mode/custom values)
│       ├── VoteResults.jsx         # Revealed votes split by QA/DEV
│       ├── ParticipantsList.jsx    # Participant list with status
│       └── ShareSession.jsx        # Shareable URL with copy button
```

### Data Flow
1. PM creates session → written to Firebase Realtime Database
2. Session URL shared → participants open URL, pick role (QA/DEV/Observer)
3. All clients subscribe via `onValue` listener → instant real-time updates
4. Participants vote → write to Firebase, all listeners fire instantly
5. PM reveals → state updated in Firebase, all users see results immediately
6. PM starts next round → current round archived, fresh round begins

### State Management
- **Firebase Realtime Database** for session data (shared across all browsers/devices worldwide)
- **Real-time sync** via Firebase `onValue` listener (instant updates, no polling)
- **Per-user identity** stored in localStorage as `poker-user-{sessionId}`
- **No custom server/API needed** — Firebase SDK handles everything client-side

### Environment Variables (required)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Roles & Permissions
| Role | Can Vote | Can Reveal | Can Next Round | Mode Toggle | Custom Values | Can Kick | Regression Modal |
|------|----------|------------|----------------|-------------|---------------|----------|-----------------|
| PM   | No       | Yes        | Yes            | Yes         | Yes           | Yes      | N/A             |
| Observer | No   | Yes        | Yes            | Yes         | Yes           | Yes      | N/A             |
| QA   | Yes      | No         | No             | No          | No            | No       | Story Points only |
| DEV  | Yes      | No         | No             | No          | No            | No       | No              |

### Consensus Detection
- Triggers when ALL DEV participants have the same vote value AND ALL QA participants have the same vote value (each group agrees internally; they don't need to match each other)
- Requires at least one group (DEV or QA) to have 2+ voters
- Participants who choose ☕ are treated as abstained and are excluded from consensus checks
- Shows a random Giphy embed iframe from 10 pre-configured celebration GIFs
- New random GIF selected each time votes are revealed

## Tech Stack
- React (functional components + hooks)
- React Router DOM (route params)
- Firebase Realtime Database (real-time session sync)
- Tailwind CSS (semantic theme tokens — dark/light mode)
- Giphy Embeds (consensus celebration)

## Known Limitations
- Firebase free tier: 1GB storage, 10GB/month transfer (more than enough for poker)
- No authentication — anyone with the URL can join (relies on trust within team)
- Session data persists in Firebase until manually deleted or TTL rules added
- User identity is per-browser (stored in localStorage)

## Future Enhancements
- Firebase Auth for user identity
- Firebase security rules to restrict write access by role
- Session expiry (Firebase TTL or scheduled cleanup)
- Session history / past round review
- PM role transfer (partially addressed by Observer backup role)
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
| 2026-05-29 | Migrated to Firebase Realtime Database (replaced polling API + Upstash Redis) | usePokerSession.js, PointPokerPage.jsx, firebase.js, api/poker-session.js, server/vitePlugin.js |
| 2026-06-02 | Added Observer role (non-voting PM backup) with PM control access and join option | JoinSessionView.jsx, PMControls.jsx, PointPokerSessionPage.jsx, pokerConfig.js, usePokerSession.js |
| 2026-06-02 | Removed Reset Votes CTA from PM controls (Next Round retained as the round reset action) | PMControls.jsx |
| 2026-06-02 | Added ☕ skip vote option to Story Points and Hours vote card sets | VoteCards.jsx, pokerConfig.js |
| 2026-06-02 | Updated consensus handling to exclude abstained (☕) votes | PointPokerSessionPage.jsx |
| 2026-06-02 | After reveal, non-voters now display "-" instead of "Waiting..." | VoteResults.jsx, ParticipantsList.jsx |
| 2026-06-02 | Revamped vote values customization — replaced comma-separated text input with visual toggle selector and add-custom-value field | PMControls.jsx |
| 2026-06-02 | Added vote averages per role (DEV/QA) and SVG pie chart for vote distribution visualization | VoteResults.jsx |
| 2026-06-02 | Updated consensus detection — now requires both DEV and QA groups to independently agree | PointPokerSessionPage.jsx |
| 2026-06-02 | Added kick participant feature for PM/Observer with automatic rejoin flow for kicked users | usePokerSession.js, ParticipantsList.jsx, PointPokerSessionPage.jsx |
| 2026-06-02 | Added 'Welcome, {username}' message to session header | PointPokerSessionPage.jsx |
