ALTER TABLE local_service_listings
    ADD COLUMN contact_number VARCHAR(20) NULL,
    ADD COLUMN allow_calls BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN allow_whatsapp BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE local_service_messages
    ADD COLUMN read_at DATETIME(6) NULL;
