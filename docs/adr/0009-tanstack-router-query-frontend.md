# ADR-0009: TanStack Router + Query for Frontend Shell

**Date**: 2026-07-14
**Status**: Accepted

## Context

Phase 2.1 requires authenticated navigation across organization, workspace, and project contexts, with list/detail screens and mutations (create/edit/archive/favorite/delete). The previous frontend was a single `App.tsx` state tree without routing or a shared cache.

## Decision

- Use **TanStack Router** for URL-driven navigation (`/login`, `/projects`, `/projects/$projectId`) with an authenticated layout route (`_app`).
- Use **TanStack Query** for server state (orgs, workspaces, projects, tasks) and cache invalidation after mutations.
- Use **React Hook Form + Zod** for project create/edit dialogs.
- Persist UI context in `localStorage`: org, workspace, last project, sidebar collapsed state.
- Keep JWT access/refresh tokens in `localStorage` (existing auth contract).

## Consequences

- Frontend depends on `@tanstack/react-router` and `@tanstack/react-query`.
- New authenticated screens should be added as routes under the `_app` layout rather than growing a single component.
- Project favorites remain project-scoped (`Project.isFavorite`), not per-user — revisit if multi-user personalization is required.
