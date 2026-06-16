# Development Workflow

## AI-First Workflow
1. Read `docs/architecture.md` before coding.
2. Review standards in `docs/coding-standards.md`.
3. Generate/update design artifacts first (contracts, schema, business rules).
4. Implement with tests.
5. Run validation (tests, static checks, security checks).
6. Update docs and review checklist.

## Review Checklist
- [ ] Architecture boundaries respected
- [ ] SOLID and clean abstractions applied
- [ ] Input validation and security checks in place
- [ ] Errors/logging follow standards
- [ ] Tests added/updated
- [ ] API and DB docs updated

## Reusable Documentation Templates

### API Endpoint Specification
Use `docs/api-contracts.md` template.

### Database Entity Specification
Use `docs/database-schema.md` template.

### User Story Template
Use `docs/business-rules.md` user story template.

### Feature Specification
Use `docs/business-rules.md` feature specification template.

### Architecture Decision Record (ADR)
Use `docs/architecture.md` ADR template.

## Security Workflow Guardrails
- Use secure defaults and least privilege.
- Ensure no secrets are committed.
- Validate and sanitize all untrusted input.
- Verify authN/authZ on protected operations.
