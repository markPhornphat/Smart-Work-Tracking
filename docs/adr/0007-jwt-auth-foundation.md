# ADR-0007: JWT Authentication Foundation

**Date**: 2026-07-14
**Status**: Accepted

## Context

Domain APIs need authenticated access without implementing full RBAC yet. We need register/login, access tokens, refresh tokens, and a clear extension point for permissions later.

## Decision

- Use **Argon2id** for password hashing (`argon2` package).
- Use **`@fastify/jwt`** for short-lived access tokens (`JWT_ACCESS_TTL`, default 15m).
- Store **opaque refresh tokens** hashed with SHA-256 in `refresh_tokens` (revocable, rotatable).
- Public routes: `POST /api/v1/auth/register|login|refresh` and `GET /health`.
- All other `/api/v1/*` routes require a valid Bearer access token.
- Organization membership is enforced for tenancy; Role/Permission tables remain unused until a future RBAC phase.
- Provide `authorize()` seam in `authHooks.ts` for future permission checks.

## Consequences

- Clients must handle token refresh.
- Seeded admin credentials are for local/dev only.
- Escalating to RBAC should plug into `authorize` without rewriting route registration.
