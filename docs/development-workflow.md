# Development Workflow

## AI-First Workflow (Self-Maintaining System)

1. **Design**: Read `docs/architecture.md`, evaluate business rules, and draft proposed endpoints/schemas.
2. **Architecture Validation**: Validate against existing ADRs (Architecture Decision Records). If the architecture shifts, draft a new ADR.
   *The AI must create a new ADR whenever:*
   - *Architecture changes*
   - *New dependencies are introduced*
   - *Database design changes*
   - *Security models change*
   - *Integration patterns change*
3. **Implementation**: Code following clean architecture and SOLID principles. Write corresponding tests.
4. **Testing**: Add or update unit/integration/E2E tests, verifying security and boundary rules.
5. **Documentation Synchronization**: Code changes are incomplete until related docs (`api-contracts.md`, `database-schema.md`, `business-rules.md`) are updated automatically by the AI agent.
6. **AI Knowledge Validation**: Review whether existing Cursor rules, Copilot instructions, prompts, and skills remain accurate. Update them if the structural paradigm or dev stack changes.
7. **Code Review**: PR generation includes an explicit review of the knowledge integrity checklist.
8. **Completion**: Code is merged only when code, docs, and AI knowledge are 100% in sync.

## Review Checklist

- [ ] Architecture reviewed
- [ ] Documentation updated
- [ ] API contracts updated
- [ ] Database documentation updated
- [ ] Security implications reviewed
- [ ] Tests added or updated
- [ ] AI skills updated if required
- [ ] ADR created if architecture changed

## Reusable Documentation Templates

### API Endpoint Specification

Use `docs/api-contracts.md` template.

### Database Entity Specification

Use `docs/database-schema.md` template.

### User Story Template

Use `docs/business-rules.md` user story template.

### the detailed generic template located at `docs/adr/template.md`

Store all ADRs in the `docs/adr/` directory with a sequential ID and a descriptive name (e.g. `0001-use-postgresql.md`). Update `docs/adr/README.md` (the ADR index) to reflect the new addition

Use `docs/business-rules.md` feature specification template.

### Architecture Decision Record (ADR)

Use `docs/architecture.md` ADR template.

## Security Workflow Guardrails

- Use secure defaults and least privilege.
- Ensure no secrets are committed.
- Validate and sanitize all untrusted input.
- Verify authN/authZ on protected operations.
