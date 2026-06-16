# Prompt Template: Bug Fixing

## Prompt
```md
Investigate and fix bug: <BUG_SUMMARY>.

Rules:
- Identify root cause first.
- Respect Clean Architecture boundaries.
- Add a regression test reproducing the issue.
- Include validation/security checks where relevant.
- Update docs if behavior/contract changes.

Return:
- Root cause
- Minimal fix proposal
- Regression tests
- Risk assessment
```
