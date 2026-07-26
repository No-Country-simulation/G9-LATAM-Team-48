-- ============================================================================
-- V4: Borrado logico de usuarios (MySQL 8+)
-- ============================================================================

ALTER TABLE users
    ADD COLUMN deleted_at TIMESTAMP NULL COMMENT 'NULL = activo; con fecha = borrado logico',
    ADD KEY idx_users_deleted_at (deleted_at);
