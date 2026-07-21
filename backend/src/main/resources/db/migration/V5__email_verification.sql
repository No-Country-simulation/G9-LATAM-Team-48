-- ============================================================================
-- V5: Verificacion de email al registrarse (MySQL 8+)
-- ============================================================================

ALTER TABLE users
    ADD COLUMN email_verified_at TIMESTAMP NULL COMMENT 'NULL = email no verificado; con fecha = verificado';

-- Usuarios ya existentes quedan verificados
UPDATE users
SET email_verified_at = CURRENT_TIMESTAMP
WHERE email_verified_at IS NULL;

CREATE TABLE email_verification_tokens (
    id          BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT       NOT NULL,
    user_email  VARCHAR(255) NOT NULL,
    token       VARCHAR(128) NOT NULL,
    expires_at  TIMESTAMP    NOT NULL,
    used_at     TIMESTAMP    NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_email_verify_token (token),
    KEY idx_email_verify_token (token),
    KEY idx_email_verify_user (user_id),
    CONSTRAINT fk_email_verify_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
