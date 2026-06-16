# Prompt Template: Feature Generation

## Goal
Generate production-ready implementation plan and code proposal for a new feature.

## Prompt
```md
You are implementing feature: <FEATURE_NAME>.

Follow these rules strictly:
1. Read and follow docs/architecture.md and docs/coding-standards.md.
2. Keep business logic out of controllers.
3. Apply Clean Architecture and SOLID.
4. Use dependency injection and repository pattern.
5. Add unit, integration, and (if needed) E2E tests.
6. Update docs (business-rules, api-contracts, database-schema) as needed.

Provide:
- Step-by-step implementation plan
- Proposed files to add/update
- Risks and mitigations
- Test plan and acceptance criteria
```
