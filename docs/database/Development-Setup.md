# Local Development Setup

## Prerequisites

- Docker Desktop / Compose
- Node.js 20+
- npm

## Steps

```bash
# 1. Start Postgres
docker compose -f database/docker/docker-compose.yml --env-file database/docker/.env up -d

# 2. Install database tooling
npm install --prefix database

# 3. Copy env if needed
cp database/.env.example database/.env
cp backend/.env.example backend/.env

# 4. Migrate + seed
npm run migrate:dev --prefix database -- --name init
npm run seed --prefix database

# 5. Backend (still serves in-memory Work Items; Prisma client wired for Phase 2)
npm install --prefix backend
npm run generate --prefix database   # ensure client generated
npm run dev:backend
```

Default credentials match `database/.env.example` (`swt` / `swt_dev_password` / `smart_work_tracking`).

## Studio

```bash
npm run studio --prefix database
```
