-- ============================================================================
-- V5: Verificacion de email al registrarse
-- ============================================================================

ALTER TABLE users
    ADD COLUMN email_verified_at TIMESTAMP NULL;

-- Usuarios ya existentes quedan verificados
UPDATE users
SET email_verified_at = CURRENT_TIMESTAMP
WHERE email_verified_at IS NULL;

CREATE TABLE email_verification_tokens (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL,
    user_email  VARCHAR(255) NOT NULL,
    token       VARCHAR(128) NOT NULL UNIQUE,
    expires_at  TIMESTAMP    NOT NULL,
    used_at     TIMESTAMP,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_email_verify_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_email_verify_token ON email_verification_tokens (token);
CREATE INDEX idx_email_verify_user ON email_verification_tokens (user_id);

COMMENT ON COLUMN users.email_verified_at IS 'NULL = email no verificado; con fecha = verificado';
