# Database Troubleshooting

## Postgres container unhealthy / not ready

```bash
docker compose -f database/docker/docker-compose.yml --env-file database/docker/.env ps
docker logs swt-postgres
```

Wait for healthcheck; port `5432` must be free on host.

## Prisma P1001 / connection refused

- Confirm compose is up and `DATABASE_URL` matches docker `.env`.
- Ensure `database/.env` is present (Prisma loads it from package root).

## Migration drift

```bash
cd database
npx prisma migrate status
npx prisma migrate reset   # local only — destroys data
```

## Seed failures (unique constraints)

Re-run after reset, or delete conflicting demo rows. Check `project.key` uniqueness per workspace.

## Backend health `database: "down"`

Backend can start without DB for unit tests (`NODE_ENV=test` without URL). In development, verify URL and that migrations were applied.

## Client out of date

```bash
npm run generate --prefix database
```
