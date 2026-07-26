-- ============================================================================
-- V3: Tokens de recuperacion / cambio de contrasena (MySQL 8+)
-- ============================================================================

CREATE TABLE password_reset_tokens (
    id          BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT       NOT NULL,
    user_email  VARCHAR(255) NOT NULL,
    token       VARCHAR(128) NOT NULL,
    expires_at  TIMESTAMP    NOT NULL,
    used_at     TIMESTAMP    NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_password_reset_token (token),
    KEY idx_password_reset_token (token),
    KEY idx_password_reset_user (user_id),
    CONSTRAINT fk_password_reset_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
