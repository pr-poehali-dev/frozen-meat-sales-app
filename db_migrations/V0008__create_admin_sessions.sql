CREATE TABLE IF NOT EXISTS t_p10284751_frozen_meat_sales_ap.admin_sessions (
  session_id varchar(64) PRIMARY KEY,
  admin_id integer NOT NULL,
  login varchar(100) NOT NULL,
  created_at timestamp DEFAULT now()
);