# Database Schema

> **Source of truth:** Prisma schema at [`database/prisma/schema.prisma`](../database/prisma/schema.prisma) and the AI/ops knowledge base under [`docs/database/`](database/).

## Current runtime note

The Fastify thin slice still uses **in-memory** Work Items for HTTP demos. Persistence (PostgreSQL + Prisma) is provisioned and seeded in this phase; domain APIs will switch to Prisma repositories in Phase 2.

## Logical hierarchy

```text
Organization
  └── Workspace
        └── Project
              ├── Workflow / WorkflowStatus
              ├── Section
              ├── Task (self-parent for subtasks)
              ├── Tag
              ├── CustomField / CustomFieldValue
              └── Templates (via ProjectTemplate)
```

See [docs/database/ERD.md](database/ERD.md) and [docs/database/Architecture.md](database/Architecture.md).

## Transitional thin-slice model (API only)

| Entity | Notes |
|--------|-------|
| Project | In-memory seed `proj_default` |
| WorkItem | Maps conceptually to future `Task` |

Do not extend the in-memory model; implement new features against Prisma entities.
