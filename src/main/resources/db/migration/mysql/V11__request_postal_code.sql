ALTER TABLE farmer_product_requests
    ADD COLUMN postal_code VARCHAR(6);

CREATE INDEX ix_product_requests_postal_code ON farmer_product_requests(postal_code, status);
