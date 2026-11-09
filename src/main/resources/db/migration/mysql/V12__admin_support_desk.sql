CREATE TABLE support_tickets (
    id CHAR(36) NOT NULL PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    subject VARCHAR(120) NOT NULL,
    message VARCHAR(2000) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    admin_reply VARCHAR(2000),
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    CONSTRAINT fk_support_ticket_user FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX ix_support_ticket_status_created (status, created_at),
    INDEX ix_support_ticket_user_created (user_id, created_at)
);
