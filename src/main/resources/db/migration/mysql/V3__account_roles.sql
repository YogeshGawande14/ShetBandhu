CREATE TABLE user_roles (
    user_id CHAR(36) NOT NULL,
    role VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, role),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT ck_user_roles_role CHECK (role IN ('FARMER', 'SHOP_OWNER', 'SUPER_ADMIN'))
);

INSERT INTO user_roles(user_id, role)
SELECT id, role FROM users;
