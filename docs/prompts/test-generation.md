# Prompt Template: Test Generation

## Prompt
```md
Generate tests for: <FEATURE_OR_MODULE>.

Requirements:
- Follow naming: should_<expected>_when_<condition>
- Prioritize domain/application unit tests
- Add integration tests for boundaries
- Add E2E for critical user journeys
- Cover positive, negative, and edge cases

Return:
- Test matrix
- Proposed test files and scenarios
- Coverage gaps and recommendations
```
