# Database package

PostgreSQL + Prisma source of truth for Smart-Work-Tracking.

## Layout

- `docker/` — Docker Compose for local Postgres 16
- `prisma/` — schema, migrations, seed
- `script/` — operational SQL (create DB, extensions, prod init)
- `backup/` — place dump files here (gitignored contents)

## Quick start

```bash
# from repo root
docker compose -f database/docker/docker-compose.yml --env-file database/docker/.env up -d

cp database/.env.example database/.env   # if needed
npm install --prefix database
npm run migrate:dev --prefix database    # first time: name the migration
npm run seed --prefix database
```

See [docs/database/Development-Setup.md](../docs/database/Development-Setup.md).
