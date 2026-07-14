# Smart-Work-Tracking

Monorepo for a work-tracking platform:

| Path | Package | Role |
|------|---------|------|
| [`backend/`](backend/) | `@smart-work-tracking/backend` | Fastify API (Clean Architecture) |
| [`frontend/`](frontend/) | `@smart-work-tracking/frontend` | Vite + React + TypeScript UI |
| [`docs/`](docs/) | — | Architecture, ADRs, API contracts |
| [`requirements/`](requirements/) | — | Product & technical requirements |

## Prerequisites
- Node.js 20+

## Setup

```bash
npm install --prefix backend
npm install --prefix frontend
cp backend/.env.example backend/.env
```

## Develop

```bash
# terminal 1 — API on :3000
npm run dev:backend

# terminal 2 — UI on :5173 (proxies /api and /health to the API)
npm run dev:frontend
```

## Scripts (from repo root)

| Command | Description |
|---------|-------------|
| `npm run dev:backend` | API hot reload |
| `npm run dev:frontend` | Vite UI |
| `npm run test` | Backend Vitest suite |
| `npm run build` | Build backend + frontend |
| `npm run start:backend` | Run built API |
| `npm run lint` | Lint both workspaces |

## Smoke checks

```bash
curl http://localhost:3000/health
curl -X POST http://localhost:3000/api/v1/work-items \
  -H "content-type: application/json" \
  -d "{\"projectId\":\"proj_default\",\"title\":\"First item\"}"
```

Seeded project id: `proj_default`.

## Architecture
See [docs/architecture.md](docs/architecture.md), [docs/api-contracts.md](docs/api-contracts.md), and ADRs under [docs/adr/](docs/adr/).
