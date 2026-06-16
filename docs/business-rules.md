# Business Rules

This document captures domain behavior independent of technical implementation.

## Rule Catalog Template

### BR-<ID>: <Rule Name>
- **Description:** <Business intent>
- **Inputs:** <Required inputs>
- **Preconditions:** <Conditions before execution>
- **Validation:** <Rules to validate>
- **Outcome:** <Expected result>
- **Exceptions:** <Business exceptions>
- **Auditing Needs:** <What to log>
- **Related Use Cases:** <Application use cases>

## User Story Template
```md
As a <persona>,
I want <capability>,
So that <business value>.

Acceptance Criteria:
- [ ] <criterion 1>
- [ ] <criterion 2>
- [ ] <criterion 3>
```

## Feature Specification Template
```md
# Feature: <Feature Name>

## Objective
<Business goal>

## Scope
- In scope: <items>
- Out of scope: <items>

## Functional Requirements
- FR-1: <requirement>
- FR-2: <requirement>

## Non-Functional Requirements
- Performance: <target>
- Security: <target>
- Observability: <target>

## Dependencies
<internal/external dependencies>

## Acceptance Criteria
- [ ] <criterion>
```
