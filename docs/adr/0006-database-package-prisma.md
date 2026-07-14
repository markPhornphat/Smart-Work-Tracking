# ADR-0006: Database Package and Prisma Placement

**Date**: 2026-07-14
**Status**: Accepted

## Context

The monorepo splits `backend/` and `frontend/`. Persistence assets (schema, migrations, seed, SQL ops scripts) must be the single source of truth consumable by the API and by DBAs/ops without burying them inside the Fastify package.

## Decision

- Own all database artifacts under **`/database`** as package `@smart-work-tracking/database`.
- Prisma schema lives at `database/prisma/schema.prisma`; migrations at `database/prisma/migrations/`; seed at `database/prisma/seed.ts`.
- Operational SQL scripts live at `database/script/`.
- Backend depends on `@prisma/client` generated from this schema and connects via a shared Prisma singleton module.
- Prisma migrations are the evolutionary source of truth; SQL scripts support ops/production initialization and documentation.

## Consequences

- Prisma CLI commands run from `database/` (or via root `db:*` scripts).
- Backend must not host a second competing `schema.prisma`.
- Schema changes require updating `/docs/database` knowledge base.

## Alternatives Considered

- **Prisma under `backend/prisma`**: Couples ops scripts and docs to the API package.
- **Separate database git repo**: Stronger isolation, weaker local DX for this stage.
