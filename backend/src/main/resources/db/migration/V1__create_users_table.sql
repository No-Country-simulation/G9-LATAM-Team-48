-- ============================================================================
-- V1: Creacion de tabla users (MySQL 8+)
-- Persiste el modelo de dominio User con autenticacion
-- ============================================================================

CREATE TABLE users (
    id              BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL COMMENT 'Hash BCrypt de la contrasena',
    role            VARCHAR(50)  NOT NULL DEFAULT 'USER',
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_users_email (email),
    KEY idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
