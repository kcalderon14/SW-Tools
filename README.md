# Redirects App

A React application for generating Akamai redirect CSV files and testing redirect rules.

## Features

- **Redirect Generator** — Configure domain, status codes, and URL mappings to produce downloadable Akamai-format CSV files. Supports multi-policy routing for localized and path-specific redirects.
- **Redirect Tester** — Paste From/To URL lists and verify that redirects resolve correctly, with a live progress bar and pass/fail results table.
- **Point Poker** — Real-time planning poker for estimating story points or hours. PM creates a session with a shareable URL; team members join as DEV, QA, or Observer. Features include configurable vote values, coffee skip option, vote averages, pie chart distribution, consensus celebration GIFs, and kick/rejoin participant management. Powered by Firebase Realtime Database.

## Tech Stack

- **Frontend**: React 19, React Router, Tailwind CSS 4
- **Build**: Vite 6
- **Server**: Express 5 (production) / Vite dev server (development)

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production

```bash
npm run start
```

This builds the app and starts the Express server on port 3001 (configurable via `PORT` environment variable).

## Project Structure

```
src/
├── components/       # Reusable UI components
├── config/           # Domain and policy configuration
├── hooks/            # Custom React hooks
├── models/           # Business logic (Redirect class)
├── pages/            # Page components (Redirects, Testing)
├── utils/            # Utility functions
├── App.jsx           # Root component with routing
├── main.jsx          # Entry point
└── index.css         # Tailwind theme and base styles
server/
├── redirectProxy.js  # URL redirect testing logic
├── vitePlugin.js     # Dev server middleware
└── index.js          # Production Express server
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT`   | `3001`  | Production server port |
| `VITE_FIREBASE_API_KEY` | — | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | — | Firebase auth domain |
| `VITE_FIREBASE_DATABASE_URL` | — | Firebase Realtime Database URL |
| `VITE_FIREBASE_PROJECT_ID` | — | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | — | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | — | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | — | Firebase app ID |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run server` | Start production server (requires build) |
| `npm start` | Build and start production server |
