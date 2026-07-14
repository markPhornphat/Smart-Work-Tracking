# ADR-0004: Monorepo Frontend/Backend Separation

**Date**: 2026-07-14
**Status**: Accepted

## Context

The application started as a single-package Node backend at the repository root. Product needs include a separate UI, and clear package boundaries simplify ownership, CI scoping, and independent deployability while keeping shared docs at the repo root.

## Decision

- Restructure the repository as a **two-package monorepo**:
  - `backend/` — Fastify + Clean Architecture API (existing Phase 1 slice)
  - `frontend/` — Vite + React + TypeScript SPA
- Keep shared knowledge at the root: `docs/`, `requirements/`, ADRs, Cursor/CI guidance.
- Root `package.json` orchestrates scripts via `npm --prefix` (packages keep independent lockfiles).

## Consequences

- Backend commands run from `backend/` or via `npm run … -w backend`.
- Frontend introduces React/Vite tooling; UI talks to the API over HTTP (CORS already enabled on Fastify).
- Future shared TypeScript packages (e.g. OpenAPI types) can be added as additional workspaces with a follow-up ADR.

## Alternatives Considered

- **Separate git repositories**: Stronger deploy isolation, weaker cross-cutting docs/ADR cohesion for this stage.
- **Backend-only with no frontend folder yet**: Leaves the requested separation incomplete.
