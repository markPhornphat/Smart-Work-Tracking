-- 006-production-init.sql
-- Production-safe initialization checklist (no demo data).
-- 1) Ensure role/database exist (001)
-- 2) Enable extensions (002)
-- 3) Apply Prisma migrations: cd database && npx prisma migrate deploy
-- 4) Optionally seed reference templates only (customize seed for prod)

SELECT 'Production init: extensions + prisma migrate deploy. Do not run demo seed in prod.' AS notice;
