-- 001-create-database.sql
-- Idempotent-ish: safe to run as a superuser on a fresh Postgres instance.
-- Docker Compose already creates POSTGRES_DB; this script is for bare-metal / prod bootstrap.

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'swt') THEN
    CREATE ROLE swt LOGIN PASSWORD 'CHANGE_ME';
  END IF;
END
$$;

SELECT 'CREATE DATABASE smart_work_tracking OWNER swt'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'smart_work_tracking')\gexec

GRANT ALL PRIVILEGES ON DATABASE smart_work_tracking TO swt;
