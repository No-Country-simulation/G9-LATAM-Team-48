-- ============================================================================
-- V10: Inserción de datos maestros en el Catálogo de Recomendaciones V2
-- Almacena los textos descriptivos oficiales para cada TipKey del sistema.
-- Catálogo ampliado: 33 recomendaciones cubriendo los 8 dominios de análisis
-- SHAP / Machine Learning definidos para EnergIA.
-- ============================================================================

INSERT INTO recommendation_catalog (tip_key, title, type) VALUES

-- ----------------------------------------------------------------------------
-- 1) Perfiles de Consumo Base
-- ----------------------------------------------------------------------------
('LOW_CONSUMPTION_BASE', 'Mantenimiento de perfil eficiente y buenas prácticas continuas', 'INFO'),
('MEDIUM_CONSUMPTION_BASE', 'Hábitos moderados con margen de optimización energética', 'INFO'),
('HIGH_CONSUMPTION_BASE', 'Revisión general requerida por alto consumo energético global', 'INFO'),

-- ----------------------------------------------------------------------------
-- 2) Climatización y Aire Acondicionado
-- ----------------------------------------------------------------------------
('AIR_CONDITIONING_OPTIMIZATION', 'Optimización de ciclos de uso y ajuste de temperatura en climatización', 'OPORTUNIDAD'),
('AC_EXCESSIVE_DAILY_USAGE', 'Uso diario del aire acondicionado por encima del promedio recomendado', 'ALERTA'),
('AC_TEMPERATURE_SUBOPTIMAL', 'Temperatura de consigna alejada del rango óptimo de 24°C', 'OPORTUNIDAD'),
('AC_FILTER_MAINTENANCE_DUE', 'Mantenimiento de filtros de aire acondicionado pendiente o vencido', 'ALERTA'),
('AC_OVERSIZED_UNIT_INEFFICIENCY', 'Equipo de climatización sobredimensionado respecto al área a climatizar', 'INFO'),

-- ----------------------------------------------------------------------------
-- 3) Aislamiento Térmico y Estructura
-- ----------------------------------------------------------------------------
('INSULATION_DEFICIENT', 'Aislamiento térmico deficiente en muros, techos o aberturas del inmueble', 'ALERTA'),
('THERMAL_BRIDGE_DETECTED', 'Presencia de puentes térmicos que incrementan la pérdida de energía', 'ALERTA'),
('SINGLE_GLAZING_WINDOWS', 'Aberturas con vidriado simple que reducen la eficiencia térmica del inmueble', 'ALERTA'),
('DOOR_WINDOW_AIR_LEAKS', 'Filtraciones de aire detectadas en puertas y ventanas', 'ALERTA'),

-- ----------------------------------------------------------------------------
-- 4) Iluminación Eficiente
-- ----------------------------------------------------------------------------
('LED_UPGRADE_NEEDED', 'Oportunidad de migración total a iluminación LED de alta eficiencia', 'OPORTUNIDAD'),
('PRESENCE_SENSOR_OPPORTUNITY', 'Instalación de sensores de presencia para reducir consumo en áreas de bajo tránsito', 'OPORTUNIDAD'),
('NATURAL_LIGHT_UNDERUTILIZED', 'Aprovechamiento insuficiente de la luz natural disponible en el espacio', 'OPORTUNIDAD'),
('OUTDATED_LIGHTING_TECHNOLOGY', 'Tecnología de iluminación obsoleta con alto consumo respecto a alternativas actuales', 'ALERTA'),

-- ----------------------------------------------------------------------------
-- 5) Consumos Fantasma y Standby
-- ----------------------------------------------------------------------------
('STANDBY_POWER_DRAIN', 'Detección de consumos fantasma o fugas de energía por modo Standby', 'OPORTUNIDAD'),
('SMART_POWER_STRIP_OPPORTUNITY', 'Oportunidad de uso de regletas inteligentes para cortar consumo en espera', 'OPORTUNIDAD'),
('CHARGERS_LEFT_PLUGGED_IN', 'Cargadores y transformadores conectados sin uso activo detectados', 'OPORTUNIDAD'),

-- ----------------------------------------------------------------------------
-- 6) Densidad de Electrodomésticos y Uso Simultáneo
-- ----------------------------------------------------------------------------
('HIGH_EQUIPMENT_DENSITY', 'Alta densidad de equipos eléctricos conectados simultáneamente en el hogar u oficina', 'ALERTA'),
('CIRCUIT_OVERLOAD_RISK', 'Riesgo de sobrecarga de circuitos por uso simultáneo de equipos de alta demanda', 'ALERTA'),
('INEFFICIENT_WASHING_CYCLE', 'Ciclos de lavado configurados de forma poco eficiente respecto a la carga real', 'OPORTUNIDAD'),
('DISHWASHER_OFF_PEAK_OPPORTUNITY', 'Oportunidad de programar el lavavajillas fuera del horario pico eléctrico', 'OPORTUNIDAD'),
('DRYER_OFF_PEAK_OPPORTUNITY', 'Oportunidad de programar la secadora fuera del horario pico eléctrico', 'OPORTUNIDAD'),

-- ----------------------------------------------------------------------------
-- 7) Horarios Comerciales y Oficinas
-- ----------------------------------------------------------------------------
('COMMERCIAL_OFF_HOURS_USE', 'Consumo eléctrico detectado en horario comercial fuera de turnos operativos', 'ALERTA'),
('PERIMETER_LIGHTING_NIGHT_WASTE', 'Iluminación perimetral nocturna innecesaria fuera de requisitos de seguridad', 'ALERTA'),
('HVAC_RUNNING_AFTER_CLOSING', 'Sistema de climatización activo después del cierre del establecimiento', 'ALERTA'),

-- ----------------------------------------------------------------------------
-- 8) Hábitos y Comportamiento Per Cápita
-- ----------------------------------------------------------------------------
('HIGH_CONSUMPTION_PER_PERSON', 'Consumo per cápita elevado por encima de los umbrales estándar recomendados', 'ALERTA'),
('ELECTRIC_SHOWER_HEAD_HIGH_USAGE', 'Uso elevado de ducha eléctrica detectado respecto al promedio por ocupante', 'ALERTA'),
('WATER_HEATER_INEFFICIENT_SCHEDULE', 'Horario de funcionamiento del termotanque no alineado con horas de menor costo', 'OPORTUNIDAD'),
('PEAK_HOUR_SHIFT', 'Desplazamiento estratégico de cargas pesadas fuera del horario pico eléctrico', 'OPORTUNIDAD'),
('EXCESSIVE_SHOWER_DURATION', 'Duración de duchas por encima del promedio recomendado por ocupante', 'ALERTA'),
('HOUSEHOLD_OCCUPANCY_MISMATCH', 'Desajuste entre la cantidad de ocupantes declarados y el patrón de consumo observado', 'INFO');
