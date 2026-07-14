# Business Rules

## Bounded Context: Work Tracking

### Entity Catalog
- **Project** — container for work (`id`, `name`, `status`)
- **WorkItem** — trackable unit (`id`, `projectId`, `title`, `status`)

### Status Vocabulary
- WorkItem status: `todo` | `in_progress` | `done`

## Rules

- **BR-1:** A work item title is required and must be non-empty after trim.
  - **Enforced in:** Domain / interface Zod validation
  - **Violation:** `VALIDATION_ERROR` (400)

- **BR-2:** A work item must reference an existing project.
  - **Enforced in:** Application create use case
  - **Violation:** `NOT_FOUND` (404) for project

- **BR-3:** New work items start in `todo` status.
  - **Enforced in:** Domain factory

- **BR-4:** Allowed WorkItem status transitions
  - `todo` → `in_progress` | `done`
  - `in_progress` → `todo` | `done`
  - `done` → `in_progress` (reopen only)
  - **Enforced in:** Domain `changeStatus`
  - **Violation:** `DOMAIN_RULE_VIOLATION` (400)

## User Stories (slice)

- **US-1:** As a contributor, I can create a work item so that new work is tracked.
- **US-2:** As a team lead, I can list work items (optionally by project) so that I see workload.
- **US-3:** As a contributor, I can open a work item by id so that I see its details.
- **US-4:** As a contributor, I can update status along allowed transitions so that progress is accurate.
