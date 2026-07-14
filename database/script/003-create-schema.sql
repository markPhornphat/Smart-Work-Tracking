-- 003-create-schema.sql
-- Reference note: evolutionary schema is owned by Prisma migrations under
-- database/prisma/migrations. Prefer `npm run migrate:deploy` from /database.
-- This file documents the operational preference for agent/DBA workflows.

-- Example (do not duplicate Prisma DDL here long-term):
--   cd database && npx prisma migrate deploy

SELECT 'Use Prisma migrations (database/prisma/migrations) as schema source of truth.' AS notice;
