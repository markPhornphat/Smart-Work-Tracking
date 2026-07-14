# ADR-0008: pnpm Workspaces

**Date**: 2026-07-14
**Status**: Accepted

## Context

ADR-0004 used independent npm lockfiles per package. The product stack now standardizes on **pnpm workspaces** for faster installs and consistent linking of `@smart-work-tracking/database` into the backend.

## Decision

- Root `pnpm-workspace.yaml` includes `backend`, `frontend`, and `database`.
- Single `pnpm-lock.yaml` at repo root; per-package `package-lock.json` removed.
- Scripts use `pnpm --filter <package> …`.
- CI uses `pnpm/action-setup` + `pnpm install --frozen-lockfile`.

## Consequences

- Contributors need pnpm 9+.
- Supersedes the independent-lockfile approach described in ADR-0004 consequences (layout of `backend`/`frontend` unchanged).
