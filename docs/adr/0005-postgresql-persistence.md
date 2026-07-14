# ADR-0005: PostgreSQL as Persistence Store

**Date**: 2026-07-14
**Status**: Accepted

## Context

The Phase 1 thin slice used in-memory repositories. Enterprise hierarchy (Organization → Workspace → Project → Task), configurable workflows, custom fields, and soft deletes require durable, relational storage with strong constraints and indexing. Local development and production should share the same engine.

## Decision

- Use **PostgreSQL 16** as the system of record.
- Run local Postgres via **Docker Compose** under `database/docker/`.
- Connection is configured through `DATABASE_URL` (and discrete `DATABASE_*` parts) in backend and database tooling env files.

## Consequences

- Schema evolution uses Prisma migrations against PostgreSQL.
- Integration tests that hit the DB need a running Postgres (or skip when URL is absent in unit-test mode).
- In-memory Work Items API remains temporarily until a later Prisma-backed API phase.

## Alternatives Considered

- **SQLite**: Insufficient for concurrent enterprise workloads and Postgres-specific features.
- **MongoDB**: Weaker relational integrity for hierarchical and workflow graph data.
