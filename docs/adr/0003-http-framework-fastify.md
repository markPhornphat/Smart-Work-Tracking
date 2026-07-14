# ADR-0003: Fastify as HTTP Framework

**Date**: 2026-07-14
**Status**: Accepted

## Context

The Phase 0 skeleton provided env validation, logging, and an error taxonomy but no HTTP transport. Phase 1 requires a thin runnable API (health + Work Items) with Zod validation at ingress and consistent error mapping. We need an HTTP framework that fits Node 20 + TypeScript, stays lightweight, and does not force a persistence choice.

## Decision

- Use **Fastify** as the HTTP framework for the interface layer.
- Use **`@fastify/cors`** with default/local-friendly settings for browser tooling during development.
- Keep controllers thin: validate with Zod, call application use cases, map failures through `mapErrorToResponse`.
- Persist nowhere yet — repositories remain in-memory until a dedicated database ADR.

New dependencies: `fastify`, `@fastify/cors`.

## Consequences

- Fast plugin model and good TypeScript ergonomics for route handlers.
- Teams must route all HTTP entry points through Fastify plugins/modules under `src/**/interface`.
- Switching frameworks later requires a superseding ADR and interface-layer rewrite.

## Alternatives Considered

- **Express**: Larger ecosystem but heavier middleware patterns and weaker first-class schema story without extra packages.
- **Hono / native `node:http`**: Viable but less aligned with common Node backend hiring familiarity for this project stage.
