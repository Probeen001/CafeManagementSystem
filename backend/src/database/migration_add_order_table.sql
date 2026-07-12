-- Apply this once to existing CafeX databases.
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS table_number SMALLINT;

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS chk_order_table;

ALTER TABLE orders
  ADD CONSTRAINT chk_order_table
  CHECK (table_number IS NULL OR table_number > 0);
