CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS staff_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_accounts_role ON staff_accounts(role);
CREATE INDEX IF NOT EXISTS idx_staff_accounts_is_active ON staff_accounts(is_active);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_staff_accounts_updated_at ON staff_accounts;
CREATE TRIGGER trg_staff_accounts_updated_at
BEFORE UPDATE ON staff_accounts
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

INSERT INTO staff_accounts (full_name, email, password_hash, role)
VALUES (
  'System Admin',
  'admin@cafex.local',
  '$2a$12$s5a8JjYa2e4SyoqP2wHTC.kmztEHUFlncB7.siliWWw92.9/NCuSq',
  'admin'
)
ON CONFLICT (email) DO NOTHING;