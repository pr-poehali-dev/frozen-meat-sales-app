
CREATE TABLE t_p10284751_frozen_meat_sales_ap.admin_users (
  id SERIAL PRIMARY KEY,
  login VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p10284751_frozen_meat_sales_ap.products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  price_unit VARCHAR(50) DEFAULT 'за кг',
  badge VARCHAR(100),
  img_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p10284751_frozen_meat_sales_ap.orders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO t_p10284751_frozen_meat_sales_ap.admin_users (login, password_hash)
VALUES ('admin', md5('admin123'));
