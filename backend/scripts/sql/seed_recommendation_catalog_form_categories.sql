-- ============================================================================
-- Seed manual: categorías nuevas alineadas al formulario Análisis IA / ML (12 features)
-- Destino: MySQL local (energia_ia.recommendation_catalog)
--
-- Schema verificado (local):
--   tip_key      VARCHAR(50)  UNIQUE
--   title        VARCHAR(150)
--   type         VARCHAR(50)  -- ALERTA | OPORTUNIDAD | INFO
--   nivel        VARCHAR(20)  -- efficient | moderate | inefficient | NULL
--   category_key VARCHAR(30)
--
-- Categorías YA existentes: climate, lighting, equipment, habits, tech
-- Categorías NUEVAS (desde el formulario):
--   insulation  ← aislamientoTermico
--   occupancy   ← cantidadPersonas / consumo per cápita
--   building    ← tipoInmueble + areaM2 + antiguedadConstruccionAnios
--   peak        ← usoHorarioPico / horasAltoConsumo
--   zone        ← zona (Urbana Interior / Costera / Suburbana)
--
-- 10 tips × 5 categorías × nivel moderate = 50 filas
-- Idempotente: INSERT IGNORE (no falla si tip_key ya existe)
--
-- UTF-8 / utf8mb4 (obligatorio):
--   - Guardar este archivo como UTF-8
--   - Ejecutar con: mysql --default-character-set=utf8mb4 ...
--   - JDBC: characterEncoding=UTF-8&connectionCollation=utf8mb4_unicode_ci
-- ============================================================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET CHARACTER SET utf8mb4;

USE energia_ia;

INSERT IGNORE INTO recommendation_catalog (tip_key, title, type, nivel, category_key) VALUES

-- ----------------------------------------------------------------------------
-- insulation ← aislamiento_termico (Bueno / Regular / Malo)
-- ----------------------------------------------------------------------------
('INSULATION_MOD_01', 'Mejorar sellado de juntas en muros y techos con aislamiento débil', 'OPORTUNIDAD', 'moderate', 'insulation'),
('INSULATION_MOD_02', 'Agregar burletes en puertas exteriores para reducir filtraciones', 'OPORTUNIDAD', 'moderate', 'insulation'),
('INSULATION_MOD_03', 'Revisar cámaras de aire y material aislante en techos prioritarios', 'OPORTUNIDAD', 'moderate', 'insulation'),
('INSULATION_MOD_04', 'Usar cortinas térmicas en ventanas de fachadas frías o soleadas', 'INFO', 'moderate', 'insulation'),
('INSULATION_MOD_05', 'Priorizar aislamiento en habitaciones de mayor permanencia diaria', 'OPORTUNIDAD', 'moderate', 'insulation'),
('INSULATION_MOD_06', 'Detectar puentes térmicos en esquinas y dinteles con termografía casera', 'ALERTA', 'moderate', 'insulation'),
('INSULATION_MOD_07', 'Sellar huecos alrededor de cañerías y cajas eléctricas en muros exteriores', 'OPORTUNIDAD', 'moderate', 'insulation'),
('INSULATION_MOD_08', 'Evaluar paneles aislantes desmontables en techos de chapa o concreto', 'INFO', 'moderate', 'insulation'),
('INSULATION_MOD_09', 'Mantener persianas cerradas en invierno por la noche para retener calor', 'INFO', 'moderate', 'insulation'),
('INSULATION_MOD_10', 'Planificar mejora de aislamiento si el formulario indica nivel Malo', 'ALERTA', 'moderate', 'insulation'),

-- ----------------------------------------------------------------------------
-- occupancy ← num_personas / consumo por ocupante
-- ----------------------------------------------------------------------------
('OCCUPANCY_MOD_01', 'Ajustar hábitos de ducha y agua caliente al número real de ocupantes', 'OPORTUNIDAD', 'moderate', 'occupancy'),
('OCCUPANCY_MOD_02', 'Compartir electrodomésticos de alto consumo entre ocupantes por turno', 'OPORTUNIDAD', 'moderate', 'occupancy'),
('OCCUPANCY_MOD_03', 'Evitar climatizar habitaciones sin ocupación activa', 'OPORTUNIDAD', 'moderate', 'occupancy'),
('OCCUPANCY_MOD_04', 'Definir meta de kWh por persona y revisarla cada mes en la app', 'INFO', 'moderate', 'occupancy'),
('OCCUPANCY_MOD_05', 'Coordinar horarios de cocina para no duplicar uso de hornos y microondas', 'OPORTUNIDAD', 'moderate', 'occupancy'),
('OCCUPANCY_MOD_06', 'Asignar responsables de apagado por zona cuando hay varios ocupantes', 'INFO', 'moderate', 'occupancy'),
('OCCUPANCY_MOD_07', 'Reducir equipos personales en standby si el consumo per cápita es alto', 'OPORTUNIDAD', 'moderate', 'occupancy'),
('OCCUPANCY_MOD_08', 'Usar lavados consolidados en lugar de ciclos individuales por persona', 'OPORTUNIDAD', 'moderate', 'occupancy'),
('OCCUPANCY_MOD_09', 'Revisar si la cantidad de ocupantes declarada coincide con el uso real', 'ALERTA', 'moderate', 'occupancy'),
('OCCUPANCY_MOD_10', 'Priorizar tip ocupancy cuando el consumo por persona supera el umbral', 'ALERTA', 'moderate', 'occupancy'),

-- ----------------------------------------------------------------------------
-- building ← tipo_inmueble + superficie_m2 + antiguedad_construccion
-- ----------------------------------------------------------------------------
('BUILDING_MOD_01', 'En casas antiguas priorizar aislamiento de techos y aberturas exteriores', 'OPORTUNIDAD', 'moderate', 'building'),
('BUILDING_MOD_02', 'En departamentos enfocar eficiencia en AA y electrodomésticos compartidos', 'OPORTUNIDAD', 'moderate', 'building'),
('BUILDING_MOD_03', 'En locales comerciales apagar climatización fuera del horario operativo', 'ALERTA', 'moderate', 'building'),
('BUILDING_MOD_04', 'Ajustar potencia de climatización al área real en m2 del inmueble', 'OPORTUNIDAD', 'moderate', 'building'),
('BUILDING_MOD_05', 'Revisar instalaciones eléctricas en construcciones con más de 20 años', 'ALERTA', 'moderate', 'building'),
('BUILDING_MOD_06', 'Zonificar calefacción y refrigeración según planta y orientación', 'INFO', 'moderate', 'building'),
('BUILDING_MOD_07', 'En superficies grandes evitar climatizar todo el volumen a la vez', 'OPORTUNIDAD', 'moderate', 'building'),
('BUILDING_MOD_08', 'Actualizar tableros y protecciones si la antigüedad de obra es elevada', 'INFO', 'moderate', 'building'),
('BUILDING_MOD_09', 'Aprovechar patio o balcón para secado natural según tipo de inmueble', 'INFO', 'moderate', 'building'),
('BUILDING_MOD_10', 'Evaluar renovación edilicia cuando antigüedad y consumo crecen juntos', 'OPORTUNIDAD', 'moderate', 'building'),

-- ----------------------------------------------------------------------------
-- peak ← usoHorarioPico / horasAltoConsumo (UI + reglas)
-- ----------------------------------------------------------------------------
('PEAK_MOD_01', 'Desplazar lavarropas y lavavajillas fuera del horario pico eléctrico', 'OPORTUNIDAD', 'moderate', 'peak'),
('PEAK_MOD_02', 'Programar termotanque y cargas pesadas en horas valle nocturnas', 'OPORTUNIDAD', 'moderate', 'peak'),
('PEAK_MOD_03', 'Evitar usar horno, secadora y AA al mismo tiempo en pico', 'ALERTA', 'moderate', 'peak'),
('PEAK_MOD_04', 'Limitar horas de alto consumo a bloques cortos y planificados', 'OPORTUNIDAD', 'moderate', 'peak'),
('PEAK_MOD_05', 'Usar timer o smart plug para cortar cargas al inicio del pico', 'OPORTUNIDAD', 'moderate', 'peak'),
('PEAK_MOD_06', 'Cargar dispositivos y notebooks en la madrugada o madrugada temprana', 'INFO', 'moderate', 'peak'),
('PEAK_MOD_07', 'Revisar la factura: identificar franja pico y fijar tope diario de kWh', 'INFO', 'moderate', 'peak'),
('PEAK_MOD_08', 'Si usoHorarioPico es true, priorizar tip peak sobre hábitos genéricos', 'ALERTA', 'moderate', 'peak'),
('PEAK_MOD_09', 'Agrupar planchado y aspirado en un solo bloque fuera de pico', 'OPORTUNIDAD', 'moderate', 'peak'),
('PEAK_MOD_10', 'Preferir cocción lenta o olla a presión en horario valle', 'INFO', 'moderate', 'peak'),

-- ----------------------------------------------------------------------------
-- zone ← zona (Urbana Interior / Urbana Costera / Suburbana)
-- ----------------------------------------------------------------------------
('ZONE_MOD_01', 'En zona costera priorizar protección contra humedad y corrosión de AA', 'OPORTUNIDAD', 'moderate', 'zone'),
('ZONE_MOD_02', 'En zona urbana interior reforzar sombra y ventilación cruzada diurna', 'OPORTUNIDAD', 'moderate', 'zone'),
('ZONE_MOD_03', 'En zona suburbana aprovechar mayor área para ventilación natural', 'INFO', 'moderate', 'zone'),
('ZONE_MOD_04', 'Ajustar temperatura de consigna según microclima de la zona declarada', 'OPORTUNIDAD', 'moderate', 'zone'),
('ZONE_MOD_05', 'En costa usar filtros y mantenimiento de AA con mayor frecuencia', 'ALERTA', 'moderate', 'zone'),
('ZONE_MOD_06', 'En interior urbano reducir aporte solar con cortinas en fachada oeste', 'OPORTUNIDAD', 'moderate', 'zone'),
('ZONE_MOD_07', 'En suburbana evaluar paneles o toldos en techos expuestos', 'INFO', 'moderate', 'zone'),
('ZONE_MOD_08', 'Adaptar horarios de ventilación a ruido y calidad del aire de la zona', 'INFO', 'moderate', 'zone'),
('ZONE_MOD_09', 'Revisar orientación y asoleamiento típicos de la zona al planificar AA', 'OPORTUNIDAD', 'moderate', 'zone'),
('ZONE_MOD_10', 'Usar la zona del formulario para priorizar tips climáticos locales', 'INFO', 'moderate', 'zone');

-- Verificación
SELECT category_key, nivel, COUNT(*) AS tips
FROM recommendation_catalog
WHERE category_key IN ('insulation', 'occupancy', 'building', 'peak', 'zone')
GROUP BY category_key, nivel
ORDER BY category_key, nivel;

SELECT COUNT(*) AS total_catalog FROM recommendation_catalog;
