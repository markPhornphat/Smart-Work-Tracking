# Product Requirements

## Product Vision
Provide a reliable work-tracking platform that improves team visibility, accountability, and delivery predictability.

## Stakeholders
- Product owner
- Engineering team
- Team leads/managers
- End users (contributors)

## Objectives

- **Objective ID:** OBJ-1
- **Description:** Enable teams to track work items within a project through create, list, get, and status-update flows.
- **Success Metric:** Core Work Item API available with automated tests; health check returns 200.
- **Target Date:** Phase 1 / thin MVP slice

## Functional Requirements

- **PRD-FR-1:** Create a work item under an existing project
  - **Priority:** Must
  - **Rationale:** Contributors need a way to capture new work.
  - **Acceptance Criteria:**
    - [ ] `POST /api/v1/work-items` accepts `projectId` and `title`
    - [ ] Response is `201` with the created work item (`status` defaults to `todo`)
    - [ ] Missing/invalid fields return `400` validation error

- **PRD-FR-2:** List work items
  - **Priority:** Must
  - **Rationale:** Teams need visibility into current work.
  - **Acceptance Criteria:**
    - [ ] `GET /api/v1/work-items` returns all work items
    - [ ] Optional `projectId` query filters the list

- **PRD-FR-3:** Get a work item by id
  - **Priority:** Must
  - **Rationale:** Contributors need detail for a single item.
  - **Acceptance Criteria:**
    - [ ] `GET /api/v1/work-items/:id` returns the work item
    - [ ] Unknown id returns `404`

- **PRD-FR-4:** Update work item status
  - **Priority:** Must
  - **Rationale:** Status changes reflect delivery progress.
  - **Acceptance Criteria:**
    - [ ] `PATCH /api/v1/work-items/:id/status` accepts a valid status
    - [ ] Invalid transitions return `400` domain error
    - [ ] Unknown id returns `404`

## Non-Functional Requirements
- Performance: health and work-item endpoints respond locally under 200ms for in-memory storage
- Reliability: process fails fast on invalid environment configuration
- Security: no secrets in logs; consistent error envelope without stack traces to clients
- Compliance: N/A for this slice
