# Copilot Instructions for Smart-Work-Tracking

## 1) Repository Intent
Smart-Work-Tracking is prepared as an AI-first engineering workspace. The immediate goal is disciplined architecture, quality standards, and reusable templates before feature implementation.

## 2) Architecture Expectations
- Follow **Clean Architecture** with strict layer boundaries:
  - `domain`: core entities, value objects, domain services, business rules
  - `application`: use cases, DTOs, ports/interfaces
  - `infrastructure`: database, external integrations, framework adapters
  - `interface`: controllers, API handlers, presenters
- Keep business logic in `domain`/`application`, never in controllers.
- Design for **DDD**, **SOLID**, feature modularity, and future event-driven integration.
- Prefer composition over inheritance.
- Keep modules loosely coupled and highly cohesive.

## 3) Coding Conventions
- Primary language target: TypeScript.
- Use explicit types for public APIs.
- Prefer immutable data and pure functions where practical.
- Enforce naming conventions:
  - Classes/Types: `PascalCase`
  - Variables/functions: `camelCase`
  - Constants/env keys: `UPPER_SNAKE_CASE`
  - Files: `kebab-case` or feature-consistent naming
- Error handling:
  - Throw/use typed domain/application errors.
  - Never swallow errors.
  - Map internal errors to safe API responses.
- Logging:
  - Structured logs (`traceId`, `actorId`, `action`, `result`, `durationMs`).
  - Never log secrets or sensitive payloads.
- Validation:
  - Validate all untrusted input at boundaries.
  - Prefer schema-based validation with explicit error messages.

## 4) Testing Expectations
- Add tests for every new behavior:
  - Unit tests for domain/application logic
  - Integration tests for infrastructure contracts
  - E2E tests for critical user flows
- Test naming format: `should_<expected>_when_<condition>`
- Minimum target guidance:
  - 80%+ statements
  - 80%+ branches on critical business modules
- Avoid brittle tests coupled to implementation details.

## 5) Security and Privacy Requirements
- Follow OWASP ASVS-style controls and secure-by-default patterns.
- Sanitize and validate all inputs.
- Use least privilege for authN/authZ.
- Never hardcode credentials, tokens, or secrets.
- Read secrets from secure runtime configuration.
- Ensure API responses do not leak internals (stack traces, SQL, keys).

## 6) Documentation Requirements
Before or with implementation changes, update relevant docs in `/docs`:
- `architecture.md` for design changes
- `business-rules.md` for domain rules
- `api-contracts.md` for endpoint changes
- `database-schema.md` for persistence model changes
- `roadmap.md` for milestone impact

Use the provided templates and keep docs synchronized with code.

## 7) Pull Request / Review Checklist
When generating code, Copilot should self-check:
1. Are architecture boundaries respected?
2. Is business logic outside controllers/UI handlers?
3. Are naming and typing standards met?
4. Are validations and error handling complete?
5. Are security controls applied (auth, validation, secrets)?
6. Are tests added/updated and meaningful?
7. Are docs updated for behavior/contract/schema changes?
8. Is duplication avoided and coupling minimized?

## 8) AI Collaboration Protocol
- Read `docs/architecture.md` first.
- Then read applicable rule docs (`coding-standards.md`, `security.md`, `testing.mdc`).
- Propose a short plan before major code edits.
- Prefer incremental, verifiable changes with tests.
