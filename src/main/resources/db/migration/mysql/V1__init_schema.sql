CREATE TABLE users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL,
  village VARCHAR(100), district VARCHAR(100),
  latitude DECIMAL(10,7), longitude DECIMAL(10,7),
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT ck_user_role CHECK (role IN ('SUPER_ADMIN','SHOP_OWNER','FARMER')),
  CONSTRAINT ck_user_latitude CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
  CONSTRAINT ck_user_longitude CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180)
);

CREATE TABLE krishi_seva_kendras (
  id CHAR(36) NOT NULL PRIMARY KEY,
  shop_name VARCHAR(140) NOT NULL,
  owner_id CHAR(36) NOT NULL,
  gstin VARCHAR(20), address VARCHAR(300) NOT NULL, contact_number VARCHAR(20) NOT NULL,
  latitude DECIMAL(10,7) NOT NULL, longitude DECIMAL(10,7) NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_kendra_owner FOREIGN KEY (owner_id) REFERENCES users(id),
  CONSTRAINT ck_kendra_latitude CHECK (latitude BETWEEN -90 AND 90),
  CONSTRAINT ck_kendra_longitude CHECK (longitude BETWEEN -180 AND 180),
  INDEX ix_kendra_owner (owner_id), INDEX ix_kendra_location (latitude, longitude)
);

CREATE TABLE agri_products (
  id CHAR(36) NOT NULL PRIMARY KEY,
  shop_id CHAR(36) NOT NULL,
  product_name VARCHAR(140) NOT NULL,
  category VARCHAR(30), description VARCHAR(1000),
  price DECIMAL(12,2) NOT NULL, unit VARCHAR(20) NOT NULL,
  stock_quantity INT NOT NULL, active BOOLEAN NOT NULL DEFAULT TRUE,
  audio_description_url VARCHAR(1000), image_url VARCHAR(1000),
  version BIGINT NOT NULL DEFAULT 0,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_product_shop FOREIGN KEY (shop_id) REFERENCES krishi_seva_kendras(id),
  CONSTRAINT ck_product_price CHECK (price > 0), CONSTRAINT ck_product_stock CHECK (stock_quantity >= 0),
  INDEX ix_product_shop (shop_id), INDEX ix_product_name (product_name)
);

CREATE TABLE mandi_rates (
  id CHAR(36) NOT NULL PRIMARY KEY,
  crop_name VARCHAR(20) NOT NULL, mandi_name VARCHAR(140) NOT NULL,
  rate_per_quintal DECIMAL(12,2) NOT NULL,
  min_rate DECIMAL(12,2) NOT NULL, max_rate DECIMAL(12,2) NOT NULL,
  transport_cost_per_qtl DECIMAL(12,2) NOT NULL,
  district VARCHAR(100), is_auto_fetched BOOLEAN NOT NULL DEFAULT FALSE,
  record_date DATE NOT NULL,
  CONSTRAINT ck_rate_range CHECK (min_rate <= rate_per_quintal AND rate_per_quintal <= max_rate),
  INDEX ix_rate_market_date (mandi_name, record_date), INDEX ix_rate_crop (crop_name)
);

CREATE TABLE purchase_orders (
  id CHAR(36) NOT NULL PRIMARY KEY,
  farmer_id CHAR(36) NOT NULL, shop_id CHAR(36) NOT NULL,
  delivery_type VARCHAR(30) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  total_amount DECIMAL(12,2) NOT NULL,
  voice_audio_url VARCHAR(1000), voice_transcript VARCHAR(2000),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), version BIGINT NOT NULL DEFAULT 0,
  CONSTRAINT fk_order_farmer FOREIGN KEY (farmer_id) REFERENCES users(id),
  CONSTRAINT fk_order_shop FOREIGN KEY (shop_id) REFERENCES krishi_seva_kendras(id),
  CONSTRAINT ck_order_status CHECK (status IN ('PENDING','CONFIRMED','DISPATCHED','DELIVERED','CANCELLED')),
  INDEX ix_order_farmer (farmer_id), INDEX ix_order_shop (shop_id)
);

CREATE TABLE order_items (
  id CHAR(36) NOT NULL PRIMARY KEY,
  order_id CHAR(36) NOT NULL, product_id CHAR(36) NOT NULL,
  quantity INT NOT NULL, unit_price DECIMAL(12,2) NOT NULL, line_total DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES agri_products(id),
  CONSTRAINT ck_item_quantity CHECK (quantity > 0),
  INDEX ix_item_order (order_id)
);

INSERT INTO mandi_rates (id,crop_name,mandi_name,rate_per_quintal,min_rate,max_rate,transport_cost_per_qtl,district,is_auto_fetched,record_date) VALUES
(UUID(),'SOYBEAN','Latur APMC',4820,4650,4980,160,'Latur',TRUE,CURRENT_DATE),
(UUID(),'SOYBEAN','Aurangabad APMC',4750,4580,4900,110,'Aurangabad',TRUE,CURRENT_DATE),
(UUID(),'TOOR','Latur APMC',8450,8200,8700,160,'Latur',TRUE,CURRENT_DATE),
(UUID(),'WHEAT','Pune Market Yard',2680,2520,2790,130,'Pune',TRUE,CURRENT_DATE),
(UUID(),'COTTON','Jalgaon APMC',7120,6900,7380,185,'Jalgaon',TRUE,CURRENT_DATE);
