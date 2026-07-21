-- ============================================================================
-- V2: Consultas del formulario Analisis IA (MySQL 8+)
-- Guarda el payload, resultado y estado de envio de email
-- ============================================================================

CREATE TABLE analisis_consultas (
    id               BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT       NULL,
    user_email       VARCHAR(255) NOT NULL,
    tipo_instalacion VARCHAR(50)  NOT NULL,
    request_json     JSON         NOT NULL,
    nivel_key        VARCHAR(50)  NULL,
    ahorro           INT          NULL,
    confidence       DOUBLE       NULL,
    benchmark        DOUBLE       NULL,
    tip_keys_json    JSON         NULL,
    response_json    JSON         NULL,
    email_status     VARCHAR(30)  NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING | SENT | FAILED | SKIPPED',
    created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_analisis_consultas_user_email (user_email),
    KEY idx_analisis_consultas_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
