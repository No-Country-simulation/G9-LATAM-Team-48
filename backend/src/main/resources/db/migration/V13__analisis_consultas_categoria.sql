-- ============================================================================
-- V13: Columna categoria en analisis_consultas (perfil ML / frontend)
-- Backfill desde response_json.category o nivel_key existente.
-- ============================================================================

ALTER TABLE analisis_consultas
    ADD COLUMN categoria VARCHAR(50) NULL COMMENT 'efficient | moderate | inefficient (PredictionResponse.category)'
        AFTER nivel_key;

UPDATE analisis_consultas
SET categoria = NULLIF(TRIM(BOTH '"' FROM JSON_UNQUOTE(JSON_EXTRACT(response_json, '$.category'))), '')
WHERE response_json IS NOT NULL
  AND JSON_EXTRACT(response_json, '$.category') IS NOT NULL;

UPDATE analisis_consultas
SET categoria = nivel_key
WHERE categoria IS NULL
  AND nivel_key IS NOT NULL
  AND nivel_key <> '';

UPDATE analisis_consultas
SET categoria = CASE
    WHEN LOWER(nivel_key) IN ('efficient', 'bajo', 'low', 'eficiente') THEN 'efficient'
    WHEN LOWER(nivel_key) IN ('inefficient', 'alto', 'high', 'ineficiente') THEN 'inefficient'
    WHEN LOWER(nivel_key) IN ('moderate', 'moderado', 'medio', 'medium') THEN 'moderate'
    ELSE 'moderate'
END
WHERE categoria IS NULL;

CREATE INDEX idx_analisis_consultas_categoria ON analisis_consultas (categoria);
