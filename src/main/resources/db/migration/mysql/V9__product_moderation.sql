ALTER TABLE agri_products
    ADD COLUMN admin_removed BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN moderation_reason VARCHAR(500),
    ADD COLUMN admin_moderated_by CHAR(36),
    ADD COLUMN moderated_at DATETIME(6);

CREATE INDEX ix_product_moderation ON agri_products(admin_removed, active);
