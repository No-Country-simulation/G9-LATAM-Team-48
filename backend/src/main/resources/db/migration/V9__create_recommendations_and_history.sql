-- Tabla de Catálogo Maestro de Recomendaciones (Staging)
CREATE TABLE recommendation_catalog (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tip_key VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL, -- ALERTA, OPORTUNIDAD, INFO
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Historial y Antiduplicados por Usuario
CREATE TABLE user_recommendations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    recommendation_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, DISMISSED, RESOLVED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_rec_catalog FOREIGN KEY (recommendation_id) REFERENCES recommendation_catalog(id),
    -- Índice para acelerar la búsqueda de duplicados activos
    INDEX idx_user_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
