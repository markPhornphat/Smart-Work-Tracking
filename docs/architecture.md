# Architecture

## Vision

Smart-Work-Tracking will evolve from a modular monolith into a microservice-ready platform while preserving clear boundaries and testability.

## Architectural Style

- Clean Architecture
- Domain Driven Design (DDD)
- SOLID principles
- Feature-based modular design
- API-first contracts
- Event-driven readiness

## Proposed Layers

1. **Domain Layer**
   - Entities, value objects, aggregates
   - Domain services and policies
   - Domain events and invariants
2. **Application Layer**
   - Use cases (commands/queries)
   - DTOs and orchestration
   - Ports/interfaces for infrastructure
3. **Infrastructure Layer**
   - Database repositories
   - Message bus publishers/subscribers
   - External API clients
4. **Interface Layer**
   - REST/GraphQL endpoints
   - Request validation and response mapping

## Feature Module Template

- `feature-name/domain/*`
- `feature-name/application/*`
- `feature-name/infrastructure/*`
- `feature-name/interface/*`

## Event-Driven Readiness

- Define domain events in domain layer.
- Publish integration events through application layer ports.
- Keep event payloads versioned and backward compatible.

## Microservice Migration Readiness

- Keep feature boundaries explicit.
- Avoid cross-module direct data access.
- Interactions should occur via contracts (APIs/events).

## Architecture Decision Records (ADRs)

We track significant architectural decisions using ADRs in the `docs/adr/` directory.

The AI must create a new ADR whenever:

- Architecture changes
- New dependencies are introduced
- Database design changes
- Security models change
- Integration patterns change

See `docs/adr/template.md` for the format, and `docs/adr/README.md` for the index of all recorded decisions.

## Repository Knowledge Integrity

Every code and architectural change must be evaluated for its impact on our self-maintaining AI system:

- **Documentation Synchronization**: Any evolution in boundaries, domain rules, or database models strictly requires updating the respective architectural design docs.
- **AI Knowledge Maintenance**: Changes in patterns, modules, or standards mean AI rules (`.github/copilot-instructions.md`, `.cursor/rules/`) must be reviewed and upgraded to ensure future AI agents continue executing correctly.
- **ADRs as AI Context**: ADRs must be consistently maintained. AI agents consume ADRs to understand constraints before generating code.
