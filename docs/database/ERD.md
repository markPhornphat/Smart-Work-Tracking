# Entity Relationship Overview

```text
Organization 1──* Workspace 1──* Project
                                    │
                         ┌──────────┼──────────┐
                         ▼          ▼          ▼
                     Workflow    Section     Tag
                         │          │
                         ▼          ▼
                  WorkflowStatus ← Task ←── CustomField
                         │          │            │
                         │     Comment/Attach    ▼
                         │     Activity/Deps  CustomFieldValue
                         │
                        User (assignee/reporter/watchers)
```

## Why each major table exists

- **organizations / workspaces** — multi-tenant boundaries for future RBAC.
- **projects** — primary work container; links optional `project_templates`.
- **project_templates** — built-in department starters (workflow, sections, tags, fields, views).
- **workflows / workflow_statuses** — configurable status sets per project.
- **sections** — grouping within a project (reorderable).
- **tasks** — work units with hierarchy via `parent_task_id`.
- **tags / task_tags** — labeled classification with colors.
- **custom_fields / custom_field_values** — typed extension points per project.
- **task_dependencies** — blocking / related links.
- **comments / attachments / activity_history** — collaboration and audit trail.
- **users / roles / permissions** — future authZ.
- **notifications** — future in-app alerts.

See `database/prisma/schema.prisma` for columns, indexes, and cascades.
