-- Idempotent because MySQL commits DDL one statement at a time if an upgrade is interrupted.
ALTER TABLE purchase_orders MODIFY farmer_id CHAR(36) NULL;

SET @agro_sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE purchase_orders ADD COLUMN customer_name VARCHAR(120) NULL AFTER farmer_id', 'SELECT 1') FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'purchase_orders' AND column_name = 'customer_name');
PREPARE agro_stmt FROM @agro_sql; EXECUTE agro_stmt; DEALLOCATE PREPARE agro_stmt;
SET @agro_sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE purchase_orders ADD COLUMN contact_phone VARCHAR(20) NULL AFTER customer_name', 'SELECT 1') FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'purchase_orders' AND column_name = 'contact_phone');
PREPARE agro_stmt FROM @agro_sql; EXECUTE agro_stmt; DEALLOCATE PREPARE agro_stmt;
SET @agro_sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE purchase_orders ADD COLUMN delivery_address VARCHAR(500) NULL AFTER delivery_type', 'SELECT 1') FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'purchase_orders' AND column_name = 'delivery_address');
PREPARE agro_stmt FROM @agro_sql; EXECUTE agro_stmt; DEALLOCATE PREPARE agro_stmt;
SET @agro_sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE purchase_orders ADD COLUMN postal_code CHAR(6) NULL AFTER delivery_address', 'SELECT 1') FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'purchase_orders' AND column_name = 'postal_code');
PREPARE agro_stmt FROM @agro_sql; EXECUTE agro_stmt; DEALLOCATE PREPARE agro_stmt;
SET @agro_sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE purchase_orders ADD COLUMN delivery_city VARCHAR(120) NULL AFTER postal_code', 'SELECT 1') FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'purchase_orders' AND column_name = 'delivery_city');
PREPARE agro_stmt FROM @agro_sql; EXECUTE agro_stmt; DEALLOCATE PREPARE agro_stmt;
SET @agro_sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE purchase_orders ADD COLUMN delivery_district VARCHAR(120) NULL AFTER delivery_city', 'SELECT 1') FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'purchase_orders' AND column_name = 'delivery_district');
PREPARE agro_stmt FROM @agro_sql; EXECUTE agro_stmt; DEALLOCATE PREPARE agro_stmt;
SET @agro_sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE purchase_orders ADD COLUMN delivery_state VARCHAR(120) NULL AFTER delivery_district', 'SELECT 1') FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'purchase_orders' AND column_name = 'delivery_state');
PREPARE agro_stmt FROM @agro_sql; EXECUTE agro_stmt; DEALLOCATE PREPARE agro_stmt;
SET @agro_sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE purchase_orders ADD COLUMN delivery_landmark VARCHAR(180) NULL AFTER delivery_state', 'SELECT 1') FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'purchase_orders' AND column_name = 'delivery_landmark');
PREPARE agro_stmt FROM @agro_sql; EXECUTE agro_stmt; DEALLOCATE PREPARE agro_stmt;
SET @agro_sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE purchase_orders ADD COLUMN guest_access_token_hash CHAR(64) NULL AFTER delivery_landmark', 'SELECT 1') FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'purchase_orders' AND column_name = 'guest_access_token_hash');
PREPARE agro_stmt FROM @agro_sql; EXECUTE agro_stmt; DEALLOCATE PREPARE agro_stmt;
SET @agro_sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE purchase_orders ADD COLUMN delivery_address_required BOOLEAN NOT NULL DEFAULT FALSE AFTER delivery_landmark', 'SELECT 1') FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'purchase_orders' AND column_name = 'delivery_address_required');
PREPARE agro_stmt FROM @agro_sql; EXECUTE agro_stmt; DEALLOCATE PREPARE agro_stmt;

SET @agro_sql = (SELECT IF(COUNT(*) = 0, 'CREATE INDEX ix_order_guest_token_hash ON purchase_orders(guest_access_token_hash)', 'SELECT 1') FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'purchase_orders' AND index_name = 'ix_order_guest_token_hash');
PREPARE agro_stmt FROM @agro_sql; EXECUTE agro_stmt; DEALLOCATE PREPARE agro_stmt;
SET @agro_sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE purchase_orders ADD CONSTRAINT ck_order_delivery_address CHECK (delivery_address_required = FALSE OR (delivery_address IS NOT NULL AND postal_code IS NOT NULL AND delivery_city IS NOT NULL AND delivery_district IS NOT NULL AND contact_phone IS NOT NULL))', 'SELECT 1') FROM information_schema.table_constraints WHERE constraint_schema = DATABASE() AND table_name = 'purchase_orders' AND constraint_name = 'ck_order_delivery_address');
PREPARE agro_stmt FROM @agro_sql; EXECUTE agro_stmt; DEALLOCATE PREPARE agro_stmt;
