-- ============================================================================
-- V1: Creación de tabla users (PostgreSQL)
-- Persiste el modelo de dominio User con autenticación
-- ============================================================================

CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(50)  NOT NULL DEFAULT 'USER',
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON COLUMN users.password_hash IS 'Hash BCrypt de la contraseña';

CREATE INDEX idx_users_email ON users (email);
