# Project Guidelines

## Code Style
- Keep changes minimal and focused on the requested task.
- Match existing style in each file; do not reformat unrelated code.
- Use clear names for files, functions, and variables.
- Add brief comments only for non-obvious logic.

## Architecture
- Use `src/` for application code and keep modules small and single-purpose.
- Isolate redirect logic from transport/framework wiring to keep core behavior testable.
- Store configuration in one place (for example `src/config/`) and avoid hardcoded environment values.

## Build and Test
- If Node.js is used:
  - Install: `npm install`
  - Build: `npm run build`
  - Test: `npm test`
- If Python is used:
  - Install: `pip install -r requirements.txt`
  - Test: `pytest`
- Prefer adding or updating tests alongside behavior changes.

## Conventions
- For redirect behavior, prefer explicit status codes (`301`, `302`, `307`, `308`) instead of implicit defaults.
- Validate redirect targets and avoid open-redirect patterns.
- Keep route mappings declarative (for example, config-driven) rather than scattering constants.
- Document any environment variables in `README.md` when they are introduced.
