ALTER TABLE users
    ADD COLUMN email VARCHAR(254) NULL,
    ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE;

CREATE UNIQUE INDEX ux_users_email ON users(email);

CREATE TABLE account_email_challenges (
    id CHAR(36) NOT NULL PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    email VARCHAR(254) NOT NULL,
    purpose VARCHAR(24) NOT NULL,
    code_hash VARCHAR(100) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    expires_at DATETIME(6) NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    reset_token_hash CHAR(64),
    reset_token_expires_at DATETIME(6),
    verified_at DATETIME(6),
    consumed_at DATETIME(6),
    CONSTRAINT fk_account_email_challenge_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX ix_account_email_challenge_user_purpose (user_id, purpose),
    INDEX ix_account_email_challenge_expiry (expires_at)
);
