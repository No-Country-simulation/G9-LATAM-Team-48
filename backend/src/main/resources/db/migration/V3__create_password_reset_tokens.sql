-- ============================================================================
-- V3: Tokens de recuperacion / cambio de contrasena
-- ============================================================================

CREATE TABLE password_reset_tokens (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL,
    user_email  VARCHAR(255) NOT NULL,
    token       VARCHAR(128) NOT NULL UNIQUE,
    expires_at  TIMESTAMP    NOT NULL,
    used_at     TIMESTAMP,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_password_reset_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_password_reset_token ON password_reset_tokens (token);
CREATE INDEX idx_password_reset_user ON password_reset_tokens (user_id);

COMMENT ON TABLE password_reset_tokens IS 'Tokens para reset de contrasena (forgot / invite)';
