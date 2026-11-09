ALTER TABLE users
    ADD COLUMN account_enabled BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX ix_users_account_enabled ON users(account_enabled);
