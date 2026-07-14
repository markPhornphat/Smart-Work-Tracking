# Seed Strategy

## Runner

`database/prisma/seed.ts` via `npm run seed --prefix database` (configured in `database/package.json` → `prisma.seed`).

## What it creates

- Demo user `demo@smartwork.local`
- Organization `demo-org` + workspace `demo-workspace`
- All built-in **ProjectTemplate** rows
- One demo **Project** per template with workflow statuses, sections, tags, custom fields
- Sample tasks (plus one subtask/comment/activity on the first task of each project)

## Idempotency

Uses upserts / existence checks so re-running seed does not duplicate projects/tasks aggressively. Safe for local resets after `migrate reset`.

## Environments

| Environment | Seed? |
|-------------|-------|
| Local / CI demo | Yes |
| Staging | Optional curated fixtures |
| Production | No demo data |

When templates change, update seed and `004`/`005` script notices accordingly.
