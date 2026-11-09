ALTER TABLE mandi_rates ADD COLUMN source_label VARCHAR(30) NOT NULL DEFAULT 'ADMIN_REPORTED';
UPDATE mandi_rates SET source_label='DEMO' WHERE is_auto_fetched=TRUE;
