-- ============================================================================
-- V15: catálogo moderado — iluminación, equipamiento, hábitos y tecnología
-- 12 tips por dominio (48 filas). Complementa CLIMATE_MOD_* de V14.
-- ============================================================================

INSERT INTO recommendation_catalog (tip_key, title, type, nivel, category_key) VALUES

-- Iluminación × moderado
('LIGHTING_MOD_01', 'Reemplazar focos restantes de incandescentes por LED de bajo consumo', 'OPORTUNIDAD', 'moderate', 'lighting'),
('LIGHTING_MOD_02', 'Aprovechar luz natural en escritorios y cocina durante el día', 'INFO', 'moderate', 'lighting'),
('LIGHTING_MOD_03', 'Instalar dimmers en áreas de convivencia para ajustar intensidad', 'OPORTUNIDAD', 'moderate', 'lighting'),
('LIGHTING_MOD_04', 'Apagar luces al salir de habitaciones poco usadas', 'INFO', 'moderate', 'lighting'),
('LIGHTING_MOD_05', 'Usar luminarias LED con etiqueta de alta eficiencia energética', 'OPORTUNIDAD', 'moderate', 'lighting'),
('LIGHTING_MOD_06', 'Colocar espejos estratégicos para amplificar luz natural', 'INFO', 'moderate', 'lighting'),
('LIGHTING_MOD_07', 'Limpiar pantallas y difusores para mantener el flujo lumínico', 'OPORTUNIDAD', 'moderate', 'lighting'),
('LIGHTING_MOD_08', 'Agrupar puntos de luz en zonas de trabajo con interruptor único', 'INFO', 'moderate', 'lighting'),
('LIGHTING_MOD_09', 'Evitar lámparas decorativas de alto consumo en horario diurno', 'OPORTUNIDAD', 'moderate', 'lighting'),
('LIGHTING_MOD_10', 'Programar temporizadores en iluminación exterior nocturna', 'OPORTUNIDAD', 'moderate', 'lighting'),
('LIGHTING_MOD_11', 'Preferir tonos claros en paredes para reducir horas de luz artificial', 'INFO', 'moderate', 'lighting'),
('LIGHTING_MOD_12', 'Revisar sensores de movimiento en pasillos y baños', 'OPORTUNIDAD', 'moderate', 'lighting'),

-- Equipamiento × moderado
('EQUIPMENT_MOD_01', 'Lavar ropa con carga completa y programa económico', 'OPORTUNIDAD', 'moderate', 'equipment'),
('EQUIPMENT_MOD_02', 'Desconectar electrodomésticos no usados con alto consumo en standby', 'OPORTUNIDAD', 'moderate', 'equipment'),
('EQUIPMENT_MOD_03', 'Usar ollas con tapa para reducir tiempo de cocción eléctrica', 'INFO', 'moderate', 'equipment'),
('EQUIPMENT_MOD_04', 'Revisar sellado de puerta del refrigerador para evitar fugas de frío', 'ALERTA', 'moderate', 'equipment'),
('EQUIPMENT_MOD_05', 'Programar lavavajillas fuera del horario pico tarifario', 'OPORTUNIDAD', 'moderate', 'equipment'),
('EQUIPMENT_MOD_06', 'Evitar abrir el horno repetidamente mientras cocina', 'INFO', 'moderate', 'equipment'),
('EQUIPMENT_MOD_07', 'Preferir microondas o air fryer para recalentar porciones pequeñas', 'INFO', 'moderate', 'equipment'),
('EQUIPMENT_MOD_08', 'Mantener serpentín trasero del refrigerador libre de polvo', 'OPORTUNIDAD', 'moderate', 'equipment'),
('EQUIPMENT_MOD_09', 'No sobrecargar extensiones con múltiples equipos de alto wattaje', 'ALERTA', 'moderate', 'equipment'),
('EQUIPMENT_MOD_10', 'Usar termo eléctrico con timer en lugar de calentar agua todo el día', 'OPORTUNIDAD', 'moderate', 'equipment'),
('EQUIPMENT_MOD_11', 'Revisar etiqueta de eficiencia energética al reemplazar electrodomésticos', 'INFO', 'moderate', 'equipment'),
('EQUIPMENT_MOD_12', 'Agrupar uso de secadora y plancha en bloques cortos consecutivos', 'OPORTUNIDAD', 'moderate', 'equipment'),

-- Hábitos × moderado
('HABITS_MOD_01', 'Desplazar cargas pesadas fuera del horario pico vespertino', 'OPORTUNIDAD', 'moderate', 'habits'),
('HABITS_MOD_02', 'Reducir tiempo de ducha a ocho minutos como meta diaria', 'OPORTUNIDAD', 'moderate', 'habits'),
('HABITS_MOD_03', 'Apagar equipos de entretenimiento al terminar la jornada', 'INFO', 'moderate', 'habits'),
('HABITS_MOD_04', 'Cargar dispositivos móviles durante horas valle nocturnas', 'INFO', 'moderate', 'habits'),
('HABITS_MOD_05', 'Evitar dejar ventiladores encendidos en habitaciones vacías', 'INFO', 'moderate', 'habits'),
('HABITS_MOD_06', 'Usar modo ahorro de energía en computadoras cuando no se usen', 'OPORTUNIDAD', 'moderate', 'habits'),
('HABITS_MOD_07', 'Planificar una auditoría visual mensual de enchufes activos', 'INFO', 'moderate', 'habits'),
('HABITS_MOD_08', 'Coordinar horarios de cocina para no encender varios fogones a la vez', 'OPORTUNIDAD', 'moderate', 'habits'),
('HABITS_MOD_09', 'Bajar persianas al salir para reducir necesidad de climatización', 'INFO', 'moderate', 'habits'),
('HABITS_MOD_10', 'Establecer recordatorio semanal para revisar consumo en la app', 'INFO', 'moderate', 'habits'),
('HABITS_MOD_11', 'Involucrar a todos los ocupantes en apagar luces y equipos compartidos', 'OPORTUNIDAD', 'moderate', 'habits'),
('HABITS_MOD_12', 'Evitar precalentar el horno más de quince minutos antes de cocinar', 'INFO', 'moderate', 'habits'),

-- Tecnología × moderado
('TECH_MOD_01', 'Instalar regleta inteligente en centro de entretenimiento', 'OPORTUNIDAD', 'moderate', 'tech'),
('TECH_MOD_02', 'Configurar apagado automático de monitor tras inactividad', 'OPORTUNIDAD', 'moderate', 'tech'),
('TECH_MOD_03', 'Usar enchufes con interruptor para cargadores y transformadores', 'INFO', 'moderate', 'tech'),
('TECH_MOD_04', 'Medir consumo standby con medidor de enchufe en equipos dudosos', 'OPORTUNIDAD', 'moderate', 'tech'),
('TECH_MOD_05', 'Actualizar firmware de termostatos inteligentes para optimizar ciclos', 'INFO', 'moderate', 'tech'),
('TECH_MOD_06', 'Conectar router y modem a regleta apagable nocturna si no se requiere 24/7', 'OPORTUNIDAD', 'moderate', 'tech'),
('TECH_MOD_07', 'Preferir equipos con certificación Energy Star al renovar tecnología', 'INFO', 'moderate', 'tech'),
('TECH_MOD_08', 'Desactivar funciones cloud innecesarias en dispositivos IoT del hogar', 'OPORTUNIDAD', 'moderate', 'tech'),
('TECH_MOD_09', 'Sincronizar horarios de smart plugs con tarifa eléctrica valle', 'OPORTUNIDAD', 'moderate', 'tech'),
('TECH_MOD_10', 'Revisar apps de monitoreo de consumo para detectar picos anómalos', 'INFO', 'moderate', 'tech'),
('TECH_MOD_11', 'Usar power bank en lugar de dejar cargador de pared siempre conectado', 'INFO', 'moderate', 'tech'),
('TECH_MOD_12', 'Etiquetar enchufes críticos versus prescindibles para apagado rápido', 'OPORTUNIDAD', 'moderate', 'tech');
