# Naming Conventions

## Tables

- Plural `snake_case` via `@@map("table_name")` (e.g. `workflow_statuses`).
- Junction tables: `task_tags`, `role_permissions`, `organization_members`.

## Columns

- UUID primary keys: `id`.
- Foreign keys: `<entity>Id` in Prisma / `<entity>_id` in SQL.
- Timestamps: `createdAt`, `updatedAt`, optional `deletedAt`.
- Boolean flags: `isArchived`, `isDone`, `isFavorite`, `isRead`.

## Soft delete

Present on aggregates: organizations, workspaces, projects, workflows, statuses, sections, tags, tasks, comments, attachments, templates, users, roles, permissions, notifications, custom fields.

Absent on junctions / value rows: cascade delete instead.

## Enums

Prisma enums for closed sets (`TaskPriority`, `CustomFieldType`, `ProjectViewType`). Workflow **status names are data**, not enums.
