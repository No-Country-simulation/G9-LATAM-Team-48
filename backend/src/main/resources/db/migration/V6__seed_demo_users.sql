-- ============================================================================
-- V6: Usuarios demo para desarrollo / demo del hackathon (MySQL 8+)
-- Password en BCrypt. Email ya verificado (pueden loguear sin mail).
-- Seguro reaplicar: no pisa filas existentes con el mismo email.
-- ============================================================================
-- Credenciales:
--   operador@energyai.com / operador123  (USER)
--   admin@energyai.com    / admin1234    (ADMIN)
--   team48@energyai.com   / team48123    (USER)
-- ============================================================================

INSERT IGNORE INTO users (name, email, password_hash, role, email_verified_at)
VALUES
    (
        'Operador',
        'operador@energyai.com',
        '$2a$10$UOQccIdCvzNRtPGuwXU/dOwclp0sa4I3uuv8RNGEu0j0Lr4QX4Sga',
        'USER',
        CURRENT_TIMESTAMP
    ),
    (
        'Admin',
        'admin@energyai.com',
        '$2a$10$cQuOdF7D9ZEXYDx1jA8GSui9k3S8vuvfan08xcrCa/mUU4KpwwNo2',
        'ADMIN',
        CURRENT_TIMESTAMP
    ),
    (
        'Team 48',
        'team48@energyai.com',
        '$2a$10$R.b2833vwIP0jMWILOdSieVBxfBcLnBXjYQtzJUwK20w5tgO0qDsG',
        'USER',
        CURRENT_TIMESTAMP
    );
