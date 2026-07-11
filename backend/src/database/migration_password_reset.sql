-- ============================================================
-- Migration: Add password reset token columns to users table
-- Run this against your existing database (DO NOT re-run schema.sql
-- as it DROPs all tables). Execute once:
--   psql -U postgres -d cafex -f migration_password_reset.sql
-- ============================================================

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password_reset_token    VARCHAR(64),
  ADD COLUMN IF NOT EXISTS password_reset_expires_at TIMESTAMPTZ;

-- Partial index — only indexes rows that actually have a token,
-- so lookups during reset are fast without bloating the index.
CREATE INDEX IF NOT EXISTS idx_users_reset_token
  ON users (password_reset_token)
  WHERE password_reset_token IS NOT NULL;
