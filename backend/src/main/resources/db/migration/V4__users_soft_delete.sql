-- ============================================================================
-- V4: Borrado logico de usuarios
-- ============================================================================

ALTER TABLE users
    ADD COLUMN deleted_at TIMESTAMP NULL;

CREATE INDEX idx_users_deleted_at ON users (deleted_at);

COMMENT ON COLUMN users.deleted_at IS 'NULL = activo; con fecha = borrado logico';
