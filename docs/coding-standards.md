# Coding Standards

## TypeScript Best Practices
- Enable strict mode (`strict: true`) when TS config is created.
- Use interfaces/types for contract-first development.
- Avoid `any`; use `unknown` + narrowing where needed.
- Keep functions focused and side effects explicit.

## Naming Conventions
- `PascalCase`: classes, types, interfaces, enums
- `camelCase`: functions, methods, variables
- `UPPER_SNAKE_CASE`: constants and env variable keys
- File names: feature-consistent and readable (`kebab-case` preferred)

## Error Handling Standards
- Use domain-specific error types.
- Distinguish validation, business, and infrastructure errors.
- Convert internal errors to safe API responses.
- Include context in logs, not sensitive data.

## Logging Standards
- Prefer structured logs.
- Include correlation fields (`traceId`, `requestId`, `actorId`).
- Log at appropriate levels (`debug`, `info`, `warn`, `error`).
- Never log credentials or secrets.

## Validation Standards
- Validate all external input at boundaries.
- Re-validate critical invariants at domain/application level.
- Return clear, deterministic validation messages.

## Dependency Injection Patterns
- Depend on abstractions (ports/interfaces), not concrete classes.
- Inject dependencies through constructors or factory wiring.
- Avoid hidden globals and service locators.

## Repository Pattern Guidance
- Repositories expose domain-friendly methods.
- Keep persistence concerns in infrastructure layer.
- Avoid leaking ORM-specific models into domain/application layers.

## OWASP-Aligned Security Baseline
- Validate and sanitize inputs.
- Apply output encoding for rendered content.
- Enforce authN/authZ checks for sensitive actions.
- Use secure defaults and least privilege.
