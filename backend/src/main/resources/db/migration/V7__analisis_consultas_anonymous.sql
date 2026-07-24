-- ============================================================================
-- V7: Permitir consultas anonimas (sin email / sin login)
-- El historial por cliente se asociara cuando el usuario este autenticado.
-- ============================================================================

ALTER TABLE analisis_consultas
    MODIFY COLUMN user_email VARCHAR(255) NULL;
