-- Dashboard: datos derivados de dataset_feature_engineering (inmutable en prod).
-- La población de filas la hace DatasetDashboardRollupInitializer (un solo scan ~95k filas).

CREATE INDEX idx_dataset_feature_engineering_mes_numero
    ON dataset_feature_engineering (mes_numero);

CREATE TABLE IF NOT EXISTS dataset_dashboard_monthly (
    filter_key       VARCHAR(96)  NOT NULL,
    mes_numero       TINYINT      NOT NULL,
    avg_consumo_kwh  DOUBLE       NOT NULL,
    avg_costo_usd    DOUBLE       NOT NULL,
    avg_actual_kwh   DOUBLE       NULL,
    avg_predicted_kwh DOUBLE      NULL,
    avg_peak_kwh     DOUBLE       NULL,
    avg_off_peak_kwh DOUBLE       NULL,
    sample_count     BIGINT       NOT NULL,
    PRIMARY KEY (filter_key, mes_numero)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS dataset_dashboard_breakdown (
    filter_key   VARCHAR(96)  NOT NULL,
    mes_numero   TINYINT      NOT NULL,
    segment      VARCHAR(64)  NOT NULL,
    avg_kwh      DOUBLE       NOT NULL,
    sample_count BIGINT       NOT NULL,
    PRIMARY KEY (filter_key, mes_numero, segment)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS dataset_dashboard_meta (
    filter_key          VARCHAR(96) NOT NULL PRIMARY KEY,
    dominant_perfil     VARCHAR(32) NULL,
    avg_calidad         DOUBLE      NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
