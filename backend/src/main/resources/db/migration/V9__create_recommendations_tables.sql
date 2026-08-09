-- ============================================================================
-- V9: Creacion de tablas para el Motor de Recomendaciones V2
-- Incluye Catálogo Maestro y tabla de historial antiduplicados por usuario
-- ============================================================================

-- 1. Tabla de Catálogo Maestro de Recomendaciones (Staging)
CREATE TABLE recommendation_catalog (
    id          BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tip_key     VARCHAR(50)  NOT NULL,
    title       VARCHAR(150) NOT NULL,
    type        VARCHAR(50)  NOT NULL COMMENT 'ALERTA, OPORTUNIDAD, INFO',
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- El TipKey debe ser único en el catálogo para evitar inconsistencias
    UNIQUE KEY uk_recommendation_tip_key (tip_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla de Historial y Antiduplicados por Usuario
CREATE TABLE user_recommendations (
    id                  BIGINT      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT      NOT NULL,
    recommendation_id   BIGINT      NOT NULL,
    status              VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, DISMISSED, RESOLVED',
    created_at          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Restricciones de integridad (Llaves Foráneas)
    CONSTRAINT fk_user_rec_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_rec_catalog 
        FOREIGN KEY (recommendation_id) REFERENCES recommendation_catalog(id) ON DELETE CASCADE,
        
    -- Control Estricto Antiduplicados en Base de Datos:
    -- Evita que un mismo usuario tenga la misma recomendación en el mismo estado 2 veces.
    UNIQUE KEY uk_user_rec_status (user_id, recommendation_id, status),
    
    -- Índice para acelerar la búsqueda del motor ("dime las activas de este usuario")
    INDEX idx_user_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;