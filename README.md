# Redirects App

A React application for generating Akamai redirect CSV files and testing redirect rules.

## Features

- **Redirect Generator** — Configure domain, status codes, and URL mappings to produce downloadable Akamai-format CSV files. Supports multi-policy routing for localized and path-specific redirects.
- **Redirect Tester** — Paste From/To URL lists and verify that redirects resolve correctly, with a live progress bar and pass/fail results table.

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

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run server` | Start production server (requires build) |
| `npm start` | Build and start production server |
