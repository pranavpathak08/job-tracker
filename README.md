# Job Tracker

Lightweight job tracking application (Backend + Vite React frontend).

This repository contains two projects:

- `backend/` - Express API using MSSQL (`mssql` + `tedious`).
- `jobtracker-client/` - React + Vite frontend.

## Prerequisites

- Node.js (recommend v18 or later) and npm installed.
- A running Microsoft SQL Server instance accessible from this machine.

## Environment variables (backend)

Create a `.env` file inside `backend/` (you can copy `backend/.env.example`). The backend expects the following variables:

- `DB_USER` — database username
- `DB_PASSWORD` — database password
- `DB_NAME` — database name
- `DB_SERVER` — database host (hostname, IP, or `localhost` / `localhost\\SQLEXPRESS`)
- `DB_PORT` — port number (default MSSQL port: `1433`)
- `JWT_SECRET` — secret used to sign JSON Web Tokens
- `PORT` — optional HTTP port for the API (defaults to `5000`)

Important: `DB_SERVER` must be a string. If you use a named instance (like `SQLEXPRESS`) you can set `DB_SERVER=localhost\\SQLEXPRESS` and optionally `DB_PORT=1433`.

## Install dependencies

From the repository root you can run (works on Windows Bash):

```bash
# install backend deps
cd backend && npm install
# in a new terminal, install frontend deps
cd ../jobtracker-client && npm install
```

Or run both from the root without changing directories:

```bash
npm --prefix backend install
npm --prefix jobtracker-client install
```

## Run in development

Start the backend (nodemon watches changes):

```bash
npm --prefix backend run dev
```

Start the frontend (Vite dev server):

```bash
npm --prefix jobtracker-client run dev
```

Open the frontend URL printed by Vite (usually `http://localhost:5173`) and the API runs on `http://localhost:5000` by default.

## Common troubleshooting

- Error: `DB Connection Failed: TypeError: The "config.server" property is required and must be of type string.`
  - Cause: `DB_SERVER` is missing or not set to a string in `backend/.env`.
  - Fix: add a valid `DB_SERVER` value to `backend/.env` (for local SQL Server, try `localhost` or `localhost\\SQLEXPRESS`).

- If you cannot connect to SQL Server locally, ensure TCP/IP is enabled in SQL Server Configuration Manager and firewall rules allow the port.

- If JWT auth fails, confirm `JWT_SECRET` is set.

## Notes

- The backend uses `mssql` + `tedious` to connect to Microsoft SQL Server.
- The frontend is built with Vite + React.

## Files added

- `backend/.env.example` — example env file with placeholders.

---

If you'd like, I can also create a real `.env` for local development with safe defaults (no secrets) and/or start the frontend for you. Tell me which you'd prefer.

## Contribution guide

Thank you for contributing! This project follows a lightweight workflow suitable for small teams.

1. Fork the repository and create a feature branch from `main` (or `docs` if you're working here):

```bash
git checkout -b feature/short-description
```

2. Keep commits small and focused. Use clear commit messages (imperative tense):

```
feat(auth): add JWT refresh endpoint
fix(jobs): handle empty description in create job
docs(readme): add contribution instructions
```

3. Run tests / linting (if added) and ensure the app builds before opening a PR.

4. Open a pull request against the repository's default branch. In the PR description include:
- What the change does
- How to run and verify locally
- Any DB migrations or env changes required

5. Address review comments and squash/fixup commits if requested.

Coding conventions (brief)
- JavaScript/React: use existing code style. Prefer functional components and hooks.
- Keep UI changes isolated to the `jobtracker-client/src` tree and backend changes in `backend/`.

If you want, I can add an ESLint/Prettier config and a Husky pre-commit hook.

## Connecting frontend and backend

The frontend currently makes requests directly to `http://localhost:5000/api/...` (see `jobtracker-client/src/pages/*` and `jobtracker-client/src/components/*`). There are three common ways to connect the frontend to the backend during development and production:

Option A — keep the current absolute URLs (quickest)
- The client points to `http://localhost:5000` hard-coded in axios calls. Start the backend on port 5000 and the frontend will hit it automatically.

Steps:

```bash
# start backend
npm --prefix backend run dev
# in another terminal, start frontend
npm --prefix jobtracker-client run dev
```

Option B — configure a Vite dev proxy (recommended for local dev)
- This removes hard-coded API origins from code and proxies API requests during development, avoiding CORS and hard-coded endpoints.
- Edit `jobtracker-client/vite.config.js` and add a `server.proxy` entry, for example:

```js
// jobtracker-client/vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
```

With that change you can keep axios calls like `/api/profile` (relative paths) and Vite will proxy them to your backend during development.

Option C — use an environment variable (flexible for production)
- Add a Vite environment variable like `VITE_API_URL` and reference it as `import.meta.env.VITE_API_URL` in the client.
- Example: create `jobtracker-client/.env.development`:

```
VITE_API_URL=http://localhost:5000
```

Then in the client replace absolute URLs with a base, e.g.:

```js
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
axios.get(`${API}/api/profile`)
```

Production
- For production builds, set the `VITE_API_URL` to your deployed API URL (for example `https://api.example.com`) before running `vite build` / your deployment pipeline.

CORS
- The backend already uses the `cors` package (see `backend/server.js`). If you use absolute URLs from the frontend, make sure the backend allows the frontend origin (or use the proxy option which avoids CORS during dev).

Quick checklist to connect locally
- Copy `backend/.env.example` to `backend/.env` and set DB variables and `JWT_SECRET`.
- Start the backend: `npm --prefix backend run dev` (defaults to port 5000).
- Start the frontend: `npm --prefix jobtracker-client run dev`.
- Visit the Vite URL (usually `http://localhost:5173`) and the frontend should make API calls to the backend.

---

If you'd like, I can:
- Convert current absolute axios URLs in the client to use `VITE_API_URL`.
- Add a Vite dev proxy config and update axios calls to relative URLs.
- Add a simple shell script or `concurrently` script to launch both servers.

Tell me which change you want and I'll implement it.
