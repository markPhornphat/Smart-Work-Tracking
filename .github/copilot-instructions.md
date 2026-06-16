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

## 6) Documentation Requirements & Synchronization
Code changes are INCOMPLETE until related documentation is updated. Documentation is a first-class deliverable.
The AI agent must continuously evaluate the impact of code on:
- `docs/architecture.md` (and ADRs)
- `docs/business-rules.md`
- `docs/api-contracts.md`
- `docs/database-schema.md`
- `docs/development-workflow.md`
- `docs/prompts/` (AI skills/prompts)

You must automatically detect affected documentation, synthesize the updates, and explain the document changes within your commits/PRs. Flag areas requiring human review if there's ambiguity. The repository documentation serves as the source of truth for future AI agents.

## 7) AI Knowledge Maintenance
Before completing and closing any task, evaluate our AI governance:
- Do existing rules in this file or Cursor rules remain valid?
- Do existing prompts and tools remain accurate?
- Does architecture guidance remain strictly applicable?
- Are code examples current?
Update affected knowledge bases so future AI interactions retain correct context.

## 8) Pull Request / Review Checklist
Create a mandatory checklist for all AI-generated pull requests. You must execute and verify the following:
- [ ] Architecture reviewed
- [ ] Documentation updated
- [ ] API contracts updated
- [ ] Database documentation updated
- [ ] Security implications reviewed
- [ ] Tests added or updated
- [ ] AI skills updated if required
- [ ] ADR created if architecture changed

## 9) AI Collaboration Protocol
- Read `docs/architecture.md` and `.cursor/rules/knowledge-integrity.mdc` first.
- Treat documentation and instructions as living code; refactor them alongside software components.
- Propose a short plan before major code edits outlining exactly which documents will need syncing.
- Ensure the PR Checklist is satisfied.
