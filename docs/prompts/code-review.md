# Prompt Template: Code Review

## Prompt
```md
Review this change against project standards.

Must check:
- Clean Architecture boundary violations
- Business logic leakage into controllers
- SOLID adherence
- Validation, error handling, logging standards
- Security concerns (OWASP-aligned)
- Test coverage and quality
- Duplication/coupling issues

Return:
1. Critical issues
2. Important improvements
3. Suggested refactors
4. Required doc updates
```
