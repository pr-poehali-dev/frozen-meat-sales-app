ALTER TABLE t_p10284751_frozen_meat_sales_ap.orders
  ADD COLUMN IF NOT EXISTS street text,
  ADD COLUMN IF NOT EXISTS house varchar(50),
  ADD COLUMN IF NOT EXISTS entrance varchar(50),
  ADD COLUMN IF NOT EXISTS apartment varchar(50),
  ADD COLUMN IF NOT EXISTS floor varchar(50),
  ADD COLUMN IF NOT EXISTS intercom varchar(50),
  ADD COLUMN IF NOT EXISTS comment text,
  ADD COLUMN IF NOT EXISTS delivery_in varchar(20),
  ADD COLUMN IF NOT EXISTS items jsonb,
  ADD COLUMN IF NOT EXISTS total integer;