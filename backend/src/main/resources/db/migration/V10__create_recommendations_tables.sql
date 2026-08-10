-- ============================================================================
-- V10: Creacion de tablas para el Motor de Recomendaciones V2
-- Ajustado con userId VARCHAR(100) para soportar emails o tokens nativos de sesión
-- ============================================================================

CREATE TABLE recommendation_catalog (
    id          BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tip_key     VARCHAR(50)  NOT NULL,
    title       VARCHAR(150) NOT NULL,
    type        VARCHAR(50)  NOT NULL COMMENT 'ALERTA, OPORTUNIDAD, INFO',
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_recommendation_tip_key (tip_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_recommendations (
    id                  BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id             VARCHAR(100) NOT NULL,
    recommendation_id   BIGINT       NOT NULL,
    status              VARCHAR(50)  NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, DISMISSED, RESOLVED',
    created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user_rec_catalog 
        FOREIGN KEY (recommendation_id) REFERENCES recommendation_catalog(id) ON DELETE CASCADE,
        
    UNIQUE KEY uk_user_rec_status (user_id, recommendation_id, status),
    INDEX idx_user_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;