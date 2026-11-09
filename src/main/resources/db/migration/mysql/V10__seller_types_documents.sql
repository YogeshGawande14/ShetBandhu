ALTER TABLE krishi_seva_kendras
    ADD COLUMN business_type VARCHAR(20) NOT NULL DEFAULT 'KENDRA',
    ADD COLUMN document_url VARCHAR(1000),
    ADD COLUMN service_summary VARCHAR(1000),
    ADD COLUMN postal_code VARCHAR(6);

CREATE INDEX ix_kendra_postal_code ON krishi_seva_kendras(postal_code);
