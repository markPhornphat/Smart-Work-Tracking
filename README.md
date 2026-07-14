# Smart-Work-Tracking

Monorepo for an enterprise work-tracking platform (pnpm workspaces).

| Path | Package | Role |
|------|---------|------|
| [`backend/`](backend/) | `@smart-work-tracking/backend` | Fastify API + JWT auth |
| [`frontend/`](frontend/) | `@smart-work-tracking/frontend` | Vite + React + TanStack Router/Query UI |
| [`database/`](database/) | `@smart-work-tracking/database` | PostgreSQL + Prisma |
| [`docs/`](docs/) | — | ADRs, API, database knowledge |

## Prerequisites

- Node.js 20+
- **pnpm 9+**
- Docker (Postgres)

## Setup

```bash
pnpm install

docker compose -f database/docker/docker-compose.yml --env-file database/docker/.env up -d

cp database/.env.example database/.env
cp backend/.env.example backend/.env

pnpm db:migrate:dev   # or: pnpm --filter @smart-work-tracking/database migrate:dev
pnpm db:seed
```

## Develop

Start **database + backend + frontend** with one command:

```bash
pnpm dev
# aliases: pnpm dev:all   |   pnpm start:all
# Windows PowerShell: .\scripts\dev.ps1
```

This will:

1. `docker compose up -d` for Postgres and wait until healthy
2. start the API on `:3000`
3. start the UI on `:5173`

Ctrl+C stops the API/UI; Postgres keeps running (`pnpm db:down` to stop it).

Or start services separately:

```bash
pnpm db:up
pnpm dev:backend    # :3000
pnpm dev:frontend   # :5173
```

## Demo login

- `admin@smartwork.local` / `Admin123!`
- UI routes: `/login`, `/projects`, `/projects/:projectId`
- Seed includes two orgs and multiple workspaces/projects for switching

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` / `dev:all` / `start:all` | Start DB + backend + frontend |
| `pnpm dev:backend` / `pnpm dev:frontend` | Local servers only |
| `pnpm test` | Backend Vitest |
| `pnpm build` | Build API + UI |
| `pnpm db:up` / `db:migrate` / `db:seed` | Database ops |

See [docs/api-contracts.md](docs/api-contracts.md) and [docs/database/Development-Setup.md](docs/database/Development-Setup.md).
