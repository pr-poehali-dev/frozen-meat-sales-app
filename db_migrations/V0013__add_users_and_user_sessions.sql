CREATE TABLE IF NOT EXISTS t_p10284751_frozen_meat_sales_ap.users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p10284751_frozen_meat_sales_ap.user_sessions (
    session_id VARCHAR(64) PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE t_p10284751_frozen_meat_sales_ap.orders ADD COLUMN IF NOT EXISTS user_id INTEGER;
