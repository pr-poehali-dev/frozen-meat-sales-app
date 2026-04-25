CREATE TABLE IF NOT EXISTS t_p10284751_frozen_meat_sales_ap.settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);
INSERT INTO t_p10284751_frozen_meat_sales_ap.settings (key, value) VALUES ('site_closed', 'false') ON CONFLICT (key) DO NOTHING;