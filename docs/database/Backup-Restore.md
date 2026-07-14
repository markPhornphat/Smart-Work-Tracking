# Backup and Restore

## Local dumps

```bash
docker exec swt-postgres pg_dump -U swt smart_work_tracking > database/backup/swt-$(date +%Y%m%d).sql
```

Restore:

```bash
cat database/backup/swt-YYYYMMDD.sql | docker exec -i swt-postgres psql -U swt smart_work_tracking
```

## Guidelines

- Never commit production dumps containing PII into git.
- Store secrets outside the repo; rotate credentials after restoring shared dumps.
- After restore, verify `prisma migrate status` still matches applied migrations.

## Production

Use managed backup (e.g. cloud automated backups / PITR). Document RPO/RTO with ops. Logical dumps under `database/backup/` are for local disaster drills only.
