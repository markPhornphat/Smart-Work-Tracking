# Database Schema

> Runtime for the Phase 1 thin slice uses **in-memory** repositories. This document is the logical target model for a future persistence ADR.

## Entities

### Project

| Column | Type | Notes |
|--------|------|-------|
| id | string (PK) | e.g. `proj_default` |
| name | string | required |
| status | string | `active` \| `archived` |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### WorkItem

| Column | Type | Notes |
|--------|------|-------|
| id | string (PK) | |
| project_id | string (FK → Project.id) | required |
| title | string | required, non-empty |
| status | string | `todo` \| `in_progress` \| `done` |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## Relationships
- Project 1—* WorkItem

## Seed (thin slice)
- Project `proj_default` / name `Default Project` / status `active` is seeded in memory so Work Item APIs can run without a Project API.
