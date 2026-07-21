-- Ejecutar una vez en MySQL (Laragon / Workbench / CLI):
--   mysql -u root -p < scripts/create-mysql-db.sql
-- o desde el cliente SQL:
CREATE DATABASE IF NOT EXISTS energia_ia
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Flyway (al arrancar el backend) crea las tablas V1–V6.
