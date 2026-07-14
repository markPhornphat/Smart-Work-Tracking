# Migration Guide

## Source of truth

Prisma migrations in `database/prisma/migrations/` evolve the schema. Do not hand-edit applied migrations in shared branches.

## Developer workflow

```bash
docker compose -f database/docker/docker-compose.yml --env-file database/docker/.env up -d
npm install --prefix database
cd database
npx prisma migrate dev --name <descriptive_name>
```

## CI / production

```bash
cd database
npx prisma migrate deploy
```

## SQL scripts vs Prisma

| Use Prisma | Use `database/script/*.sql` |
|------------|-----------------------------|
| Day-to-day schema changes | Create role/DB on bare metal |
| App deploys | Enable extensions before first migrate |
| Seed reference/demo | DBA checklists / documented rollbacks |

After schema changes, update ERD.md / Architecture.md / Naming-Convention.md if structures or conventions shift.
