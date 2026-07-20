-- ============================================================================
-- V2: Consultas del formulario Analisis IA
-- Guarda el payload, resultado y estado de envio de email
-- ============================================================================

CREATE TABLE analisis_consultas (
    id               BIGSERIAL PRIMARY KEY,
    user_id          BIGINT,
    user_email       VARCHAR(255) NOT NULL,
    tipo_instalacion VARCHAR(50)  NOT NULL,
    request_json     JSONB        NOT NULL,
    nivel_key        VARCHAR(50),
    ahorro           INTEGER,
    confidence       DOUBLE PRECISION,
    benchmark        DOUBLE PRECISION,
    tip_keys_json    JSONB,
    response_json    JSONB,
    email_status     VARCHAR(30)  NOT NULL DEFAULT 'PENDING',
    created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analisis_consultas_user_email ON analisis_consultas (user_email);
CREATE INDEX idx_analisis_consultas_created_at ON analisis_consultas (created_at DESC);

COMMENT ON TABLE analisis_consultas IS 'Consultas del Analisis IA (para historial y envio por email)';
COMMENT ON COLUMN analisis_consultas.email_status IS 'PENDING | SENT | FAILED | SKIPPED';
