# 2. Initial Project Skeleton / Tech Stack Choices

Date: 2026-06-16

## Status

Accepted

## Context

We are initializing the Smart-Work-Tracking repository using the defined Clean Architecture structure. To bootstrap the TypeScript Node.js backend, we need standard tooling across the board.

## Decision

- **Runtime & Language**: Node.js v20+ with TypeScript.
- **Formatting & Linting**: Prettier and ESLint (Flat Config) ensuring strict adherence.
- **Testing Framework**: Vitest for unit and integration testing. Vitest provides native TypeScript support and is fast.
- **Validation**: Zod for schema-based input parsing and environment variable configuration.
- **Logging**: Pino for fast, low-overhead structured JSON logging.
- **Module Structure**: `src/shared` divided into `domain`, `application`, `infrastructure`, and `interface` to establish shared conventions.

## Consequences

- Consistent coding standards out of the box via CI pipelines.
- Uniform typed configurations and strict validations provide secure-by-default environment loading.
- We rely on `tsup` for swift building.
- Teams must write tests with Vitest and leverage `AppError` subclasses for consistent error propagation.
