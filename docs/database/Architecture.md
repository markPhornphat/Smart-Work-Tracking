# Database Architecture

Smart-Work-Tracking persists enterprise work data in **PostgreSQL 16** via **Prisma**.

## Sources of truth

| Concern | Location |
|---------|----------|
| Schema / migrations | `database/prisma/` |
| Ops SQL scripts | `database/script/` |
| Local engine | `database/docker/docker-compose.yml` |
| Runtime connection | Backend `DATABASE_URL` |

## Hierarchy

Organization → Workspace → Project → (Workflow/Statuses, Sections, Tags, CustomFields, Tasks).

Tasks support self-referential subtasks, tags, comments, attachments, dependencies, watchers, and activity history.

Workflow statuses are **rows**, not enums, so each project configures its own lifecycle.

## Soft deletes

Aggregate tables use nullable `deletedAt`. Junction / value tables typically hard-delete with cascade.

## AI / future RBAC

`User`, `Role`, `Permission`, and `Notification` tables exist as placeholders for auth and AI-driven notifications.
