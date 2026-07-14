# Production Deployment

1. Provision PostgreSQL 16+.
2. Create role/database (see `database/script/001-create-database.sql`).
3. Enable extensions (`002-create-extensions.sql`).
4. Set secrets: `DATABASE_URL` for API and migrate jobs.
5. Run `npx prisma migrate deploy` from `database/`.
6. Do **not** run demo seed in production. Optionally load reference templates via a production-safe seeder.
7. Point backend at `DATABASE_URL`; confirm `/health` reports `database: "up"`.

See also `database/script/006-production-init.sql`.
