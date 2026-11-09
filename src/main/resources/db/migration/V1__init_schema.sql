CREATE TABLE app_users (
    id UUID PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    user_role VARCHAR(20) NOT NULL CHECK (user_role IN ('FARMER','SHOP_OWNER')),
    village VARCHAR(100), district VARCHAR(100),
    latitude NUMERIC(10,7), longitude NUMERIC(10,7),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_user_latitude CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
    CONSTRAINT ck_user_longitude CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180)
);
CREATE TABLE krishi_seva_kendras (
    id UUID PRIMARY KEY,
    shop_name VARCHAR(140) NOT NULL,
    owner_id UUID NOT NULL REFERENCES app_users(id),
    address VARCHAR(300) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    latitude NUMERIC(10,7) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude NUMERIC(10,7) NOT NULL CHECK (longitude BETWEEN -180 AND 180)
);
CREATE INDEX ix_kendra_owner ON krishi_seva_kendras(owner_id);
CREATE TABLE agri_products (
    id UUID PRIMARY KEY,
    shop_id UUID NOT NULL REFERENCES krishi_seva_kendras(id),
    name VARCHAR(140) NOT NULL,
    category VARCHAR(80), description VARCHAR(1000),
    price NUMERIC(12,2) NOT NULL CHECK (price > 0),
    unit VARCHAR(20) NOT NULL,
    stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ix_product_shop ON agri_products(shop_id);
CREATE INDEX ix_product_name ON agri_products(name);
CREATE TABLE mandi_rates (
    id UUID PRIMARY KEY,
    crop_name VARCHAR(120) NOT NULL,
    market_name VARCHAR(140) NOT NULL,
    district VARCHAR(100) NOT NULL,
    rate_date DATE NOT NULL,
    min_price NUMERIC(12,2) NOT NULL CHECK (min_price >= 0),
    max_price NUMERIC(12,2) NOT NULL CHECK (max_price >= min_price),
    modal_price NUMERIC(12,2) NOT NULL CHECK (modal_price BETWEEN min_price AND max_price),
    unit VARCHAR(20) NOT NULL DEFAULT 'QUINTAL'
);
CREATE INDEX ix_rate_market_date ON mandi_rates(market_name, rate_date DESC);
CREATE INDEX ix_rate_crop ON mandi_rates(crop_name);
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY,
    farmer_id UUID NOT NULL REFERENCES app_users(id),
    shop_id UUID NOT NULL REFERENCES krishi_seva_kendras(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PLACED','CONFIRMED','FULFILLED','CANCELLED')),
    total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
    voice_audio_url VARCHAR(1000),
    voice_transcript VARCHAR(2000),
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ix_order_farmer ON purchase_orders(farmer_id);
CREATE TABLE order_items (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES agri_products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    line_total NUMERIC(12,2) NOT NULL CHECK (line_total >= 0)
);
