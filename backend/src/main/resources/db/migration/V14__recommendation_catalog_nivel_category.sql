-- ============================================================================
-- V14: nivel y category_key en recommendation_catalog + piloto clima/moderado
-- Fase 1 del catálogo ampliado (~100 tips por categoría × nivel en fases posteriores)
-- ============================================================================

ALTER TABLE recommendation_catalog
    ADD COLUMN nivel VARCHAR(20) NULL
        COMMENT 'efficient|moderate|inefficient; NULL = aplica a todos los niveles'
        AFTER type,
    ADD COLUMN category_key VARCHAR(30) NULL
        COMMENT 'climate|lighting|equipment|habits|tech'
        AFTER nivel;

CREATE INDEX idx_recommendation_catalog_nivel_category
    ON recommendation_catalog (nivel, category_key);

-- Backfill category_key para las 33 filas V11
UPDATE recommendation_catalog SET category_key = CASE tip_key
    WHEN 'LOW_CONSUMPTION_BASE' THEN 'habits'
    WHEN 'MEDIUM_CONSUMPTION_BASE' THEN 'habits'
    WHEN 'HIGH_CONSUMPTION_BASE' THEN 'habits'
    WHEN 'AIR_CONDITIONING_OPTIMIZATION' THEN 'climate'
    WHEN 'AC_EXCESSIVE_DAILY_USAGE' THEN 'climate'
    WHEN 'AC_TEMPERATURE_SUBOPTIMAL' THEN 'climate'
    WHEN 'AC_FILTER_MAINTENANCE_DUE' THEN 'climate'
    WHEN 'AC_OVERSIZED_UNIT_INEFFICIENCY' THEN 'climate'
    WHEN 'INSULATION_DEFICIENT' THEN 'climate'
    WHEN 'THERMAL_BRIDGE_DETECTED' THEN 'climate'
    WHEN 'SINGLE_GLAZING_WINDOWS' THEN 'climate'
    WHEN 'DOOR_WINDOW_AIR_LEAKS' THEN 'climate'
    WHEN 'LED_UPGRADE_NEEDED' THEN 'lighting'
    WHEN 'PRESENCE_SENSOR_OPPORTUNITY' THEN 'lighting'
    WHEN 'NATURAL_LIGHT_UNDERUTILIZED' THEN 'lighting'
    WHEN 'OUTDATED_LIGHTING_TECHNOLOGY' THEN 'lighting'
    WHEN 'STANDBY_POWER_DRAIN' THEN 'habits'
    WHEN 'SMART_POWER_STRIP_OPPORTUNITY' THEN 'tech'
    WHEN 'CHARGERS_LEFT_PLUGGED_IN' THEN 'habits'
    WHEN 'HIGH_EQUIPMENT_DENSITY' THEN 'equipment'
    WHEN 'CIRCUIT_OVERLOAD_RISK' THEN 'equipment'
    WHEN 'INEFFICIENT_WASHING_CYCLE' THEN 'equipment'
    WHEN 'DISHWASHER_OFF_PEAK_OPPORTUNITY' THEN 'equipment'
    WHEN 'DRYER_OFF_PEAK_OPPORTUNITY' THEN 'equipment'
    WHEN 'COMMERCIAL_OFF_HOURS_USE' THEN 'equipment'
    WHEN 'PERIMETER_LIGHTING_NIGHT_WASTE' THEN 'lighting'
    WHEN 'HVAC_RUNNING_AFTER_CLOSING' THEN 'climate'
    WHEN 'HIGH_CONSUMPTION_PER_PERSON' THEN 'habits'
    WHEN 'ELECTRIC_SHOWER_HEAD_HIGH_USAGE' THEN 'habits'
    WHEN 'WATER_HEATER_INEFFICIENT_SCHEDULE' THEN 'habits'
    WHEN 'PEAK_HOUR_SHIFT' THEN 'habits'
    WHEN 'EXCESSIVE_SHOWER_DURATION' THEN 'habits'
    WHEN 'HOUSEHOLD_OCCUPANCY_MISMATCH' THEN 'habits'
    ELSE 'habits'
END;

-- Perfiles base: nivel explícito; el resto queda NULL (todas las categorías de consumo)
UPDATE recommendation_catalog SET nivel = 'efficient' WHERE tip_key = 'LOW_CONSUMPTION_BASE';
UPDATE recommendation_catalog SET nivel = 'moderate' WHERE tip_key = 'MEDIUM_CONSUMPTION_BASE';
UPDATE recommendation_catalog SET nivel = 'inefficient' WHERE tip_key = 'HIGH_CONSUMPTION_BASE';

-- Piloto Fase 2: 15 tips climatización × nivel moderado
INSERT INTO recommendation_catalog (tip_key, title, type, nivel, category_key) VALUES
('CLIMATE_MOD_01', 'Ajustar termostato a 24°C en horario diurno', 'OPORTUNIDAD', 'moderate', 'climate'),
('CLIMATE_MOD_02', 'Ventilar con corrientes cruzadas antes de encender el aire acondicionado', 'OPORTUNIDAD', 'moderate', 'climate'),
('CLIMATE_MOD_03', 'Limpiar filtros del equipo de climatización cada tres meses', 'OPORTUNIDAD', 'moderate', 'climate'),
('CLIMATE_MOD_04', 'Cerrar cortinas en las horas de mayor radiación solar', 'INFO', 'moderate', 'climate'),
('CLIMATE_MOD_05', 'Evitar climatizar habitaciones que permanecen vacías', 'OPORTUNIDAD', 'moderate', 'climate'),
('CLIMATE_MOD_06', 'Revisar y reemplazar burletes deteriorados en ventanas', 'OPORTUNIDAD', 'moderate', 'climate'),
('CLIMATE_MOD_07', 'Usar modo eco o sleep del equipo cuando sea posible', 'INFO', 'moderate', 'climate'),
('CLIMATE_MOD_08', 'Descongelar el split si el hielo reduce el rendimiento', 'ALERTA', 'moderate', 'climate'),
('CLIMATE_MOD_09', 'No obstruir rejillas ni difusores de salida de aire', 'INFO', 'moderate', 'climate'),
('CLIMATE_MOD_10', 'Programar el prec enfriamiento treinta minutos antes de llegar', 'OPORTUNIDAD', 'moderate', 'climate'),
('CLIMATE_MOD_11', 'Mantener como máximo ocho grados de diferencia con el exterior', 'OPORTUNIDAD', 'moderate', 'climate'),
('CLIMATE_MOD_12', 'Complementar el aire acondicionado con ventilador de techo', 'INFO', 'moderate', 'climate'),
('CLIMATE_MOD_13', 'Revisar carga de refrigerante si el equipo rinde poco', 'ALERTA', 'moderate', 'climate'),
('CLIMATE_MOD_14', 'Aprovechar sombra natural en fachadas expuestas al oeste', 'INFO', 'moderate', 'climate'),
('CLIMATE_MOD_15', 'Agrupar actividades que generan calor fuera del horario pico', 'OPORTUNIDAD', 'moderate', 'climate');
