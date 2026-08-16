/**
 * Generates LEVEL_CATALOG_KEYS and LEVEL_TITLES_BY_LANG for efficient/inefficient tiers.
 * Run: node scripts/generate-level-catalog.mjs >> append manually or overwrite section
 */
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const DOMAINS = ['CLIMATE', 'LIGHTING', 'EQUIPMENT', 'HABITS', 'TECH']
const PREFIXES = { efficient: 'EFF', inefficient: 'INEFF' }

const TITLES = {
  efficient: {
    es: {
      CLIMATE: [
        'Mantener termostato en 25°C cuando el clima lo permita',
        'Usar modo ventilación sin compresor en días templados',
        'Aprovechar brisa nocturna para refrescar antes del amanecer',
        'Revisar calendario estacional del equipo de climatización',
        'Mantener filtros limpios según plan de mantenimiento preventivo',
        'Usar cortinas térmicas solo cuando aporten valor adicional',
        'Evitar sobreenfriar espacios ya confortables',
        'Registrar consumo mensual de climatización para detectar desvíos',
        'Cerrar puertas interiores para zonificar sin exceso de equipos',
        'Preferir ventilador de bajo consumo antes que bajar más la temperatura',
        'Verificar que el termostato no esté expuesto a sol directo',
        'Compartir buenas prácticas de climatización con otros ocupantes',
      ],
      LIGHTING: [
        'Apagar luces en zonas con suficiente luz natural',
        'Usar iluminación puntual en lugar de iluminar toda la habitación',
        'Mantener focos LED en buen estado sin parpadeo',
        'Ajustar intensidad al mínimo confortable en cada espacio',
        'Revisar que sensores de presencia estén bien calibrados',
        'Evitar luces nocturnas permanentes innecesarias',
        'Limitar iluminación decorativa a horarios definidos',
        'Preferir lámparas direccionables para evitar sobreiluminar',
        'Documentar layout de iluminación eficiente del hogar',
        'Cambiar solo los focos que aún no son LED',
        'Usar temporizadores en exteriores con horario mínimo necesario',
        'Medir consumo de iluminación tras cambios para validar ahorro',
      ],
      EQUIPMENT: [
        'Usar programas eco en todos los ciclos compatibles',
        'Mantener electrodomésticos en modo eficiente de fábrica',
        'Desconectar equipos secundarios fuera de temporada',
        'Revisar manual de eficiencia de cada electrodoméstico principal',
        'Evitar standby innecesario en equipos ya eficientes',
        'Usar olla a presión eléctrica para reducir tiempo de cocción',
        'Mantener refrigerador entre 3°C y 5°C sin sobre-enfriar',
        'Planificar una carga semanal de lavado consolidada',
        'Preferir secado al aire cuando el clima lo permita',
        'Etiquetar equipos por consumo relativo en el hogar',
        'Revisar sellos de electrodomésticos una vez por trimestre',
        'Renovar equipos solo cuando la eficiencia lo justifique',
      ],
      HABITS: [
        'Mantener rutina de apagado al salir de cada habitación',
        'Limitar duchas a lo necesario con cierre rápido del grifo',
        'Usar horario valle para cargas programables habituales',
        'Revisar consumo semanal en la app como hábito fijo',
        'Coordinar uso de equipos compartidos para evitar duplicidad',
        'Evitar precalentar espacios que ya están confortables',
        'Cerrar persianas en verano antes de la radiación máxima',
        'Preferir actividades manuales de bajo consumo cuando sea viable',
        'Establecer meta de reducción incremental del 2% mensual',
        'Apagar tiras LED decorativas al dormir',
        'Usar regla de un equipo pesado encendido a la vez',
        'Celebrar y documentar hitos de ahorro con el hogar',
      ],
      TECH: [
        'Automatizar apagado nocturno de periféricos de cómputo',
        'Usar medidor inteligente para confirmar ausencia de standby',
        'Mantener firmware actualizado en dispositivos conectados',
        'Configurar alertas de consumo anómalo en apps compatibles',
        'Preferir Wi-Fi programable para reducir equipos activos',
        'Desactivar LEDs indicadores innecesarios cuando sea posible',
        'Usar regletas con horario para cargadores compartidos',
        'Auditar dispositivos IoT y retirar los que no aporten valor',
        'Sincronizar escenas domóticas con presencia real en el hogar',
        'Medir consumo de rack de red y optimizar horarios',
        'Elegir monitores eficientes al ampliar puestos de trabajo',
        'Exportar reportes mensuales de consumo conectado',
      ],
    },
    en: {
      CLIMATE: [
        'Keep thermostat at 25°C when weather allows',
        'Use fan-only mode on mild days',
        'Use night breeze to cool before sunrise',
        'Review seasonal HVAC schedule',
        'Keep filters clean per preventive maintenance plan',
        'Use thermal curtains only when they add value',
        'Avoid over-cooling already comfortable spaces',
        'Log monthly HVAC consumption to spot drift',
        'Close interior doors to zone without extra units',
        'Prefer low-power fan before lowering temperature further',
        'Ensure thermostat is not exposed to direct sun',
        'Share HVAC best practices with other occupants',
      ],
      LIGHTING: [
        'Turn off lights where natural light is enough',
        'Use task lighting instead of whole-room lighting',
        'Keep LED bulbs in good condition without flicker',
        'Set intensity to minimum comfortable level per space',
        'Verify motion sensors are properly calibrated',
        'Avoid unnecessary permanent night lights',
        'Limit decorative lighting to defined hours',
        'Prefer directional lamps to avoid over-lighting',
        'Document efficient home lighting layout',
        'Replace only bulbs not yet LED',
        'Use outdoor timers with minimum required schedule',
        'Measure lighting consumption after changes to validate savings',
      ],
      EQUIPMENT: [
        'Use eco programs on all compatible cycles',
        'Keep appliances in factory efficient mode',
        'Unplug seasonal secondary equipment',
        'Review efficiency manual for each main appliance',
        'Avoid unnecessary standby on already efficient gear',
        'Use electric pressure cooker to shorten cooking time',
        'Keep refrigerator between 3°C and 5°C without over-cooling',
        'Plan one consolidated weekly laundry load',
        'Prefer air drying when weather allows',
        'Label appliances by relative home consumption',
        'Check appliance seals once per quarter',
        'Replace equipment only when efficiency justifies it',
      ],
      HABITS: [
        'Keep turn-off routine when leaving each room',
        'Limit showers to needed time with quick tap shutoff',
        'Use off-peak hours for regular programmable loads',
        'Review weekly consumption in app as fixed habit',
        'Coordinate shared equipment use to avoid duplication',
        'Avoid pre-heating spaces already comfortable',
        'Close blinds in summer before peak radiation',
        'Prefer manual low-consumption activities when viable',
        'Set incremental 2% monthly reduction goal',
        'Turn off decorative LED strips at bedtime',
        'Use rule of one heavy appliance on at a time',
        'Celebrate and document savings milestones at home',
      ],
      TECH: [
        'Automate nightly shutdown of computer peripherals',
        'Use smart meter to confirm no standby draw',
        'Keep firmware updated on connected devices',
        'Configure anomaly alerts in compatible consumption apps',
        'Prefer schedulable Wi-Fi to reduce active gear',
        'Disable unnecessary indicator LEDs when possible',
        'Use scheduled power strips for shared chargers',
        'Audit IoT devices and remove those without value',
        'Sync smart home scenes with actual presence',
        'Measure network rack consumption and optimize schedules',
        'Choose efficient monitors when adding workstations',
        'Export monthly connected consumption reports',
      ],
    },
  },
  inefficient: {
    es: {
      CLIMATE: [
        'Revisar urgentemente equipos de climatización con consumo creciente',
        'Sustituir unidades viejas con bajo SEER por modelos eficientes',
        'Priorizar aislamiento en habitaciones con mayor pérdida térmica',
        'Limitar horas de AA a bloques estrictos en horario pico',
        'Detectar y sellar filtraciones de aire en ventanas prioritarias',
        'Evitar climatizar zonas abiertas o mal cerradas',
        'Usar termostato programable con límites máximos de uso diario',
        'Solicitar mantenimiento profesional si el consumo no baja',
        'Reducir temperatura de consigna un grado por semana hasta 24°C',
        'Instalar sensor puerta-ventana para apagar AA al ventilar',
        'Evitar usar AA simultáneamente con calefacción eléctrica',
        'Planificar inversión en doble vidriado en la próxima renovación',
      ],
      LIGHTING: [
        'Sustituir de inmediato todas las lámparas incandescentes o halógenas',
        'Eliminar iluminación exterior encendida todo el día sin necesidad',
        'Instalar sensores de movimiento en todas las zonas de tránsito',
        'Reducir cantidad de puntos de luz activos en áreas amplias',
        'Apagar iluminación decorativa hasta completar migración LED',
        'Revisar balastos viejos que generan consumo excesivo',
        'Priorizar iluminación LED en cocina y baños de alto uso',
        'Usar una sola fuente de luz central en lugar de múltiples lámparas',
        'Medir antes y después del cambio masivo a LED',
        'Desactivar letreros o carteles luminosos no esenciales',
        'Programar apagado total de luces exteriores en horario diurno',
        'Consultar subsidio o programa local de eficiencia lumínica',
      ],
      EQUIPMENT: [
        'Reemplazar electrodomésticos de más de diez años con etiqueta A o superior',
        'Evitar usar secadora en días soleados; usar tendedero',
        'No operar lavadora, horno y microondas al mismo tiempo',
        'Revisar circuito dedicado para equipos de alto consumo',
        'Desconectar segunda heladera o freezer si no es indispensable',
        'Usar timer en termotanque para limitar horas de calentamiento',
        'Evitar plancha y aspiradora en horario pico eléctrico',
        'Consolidar cocción en un solo bloque diario',
        'Retirar equipos obsoletos que permanecen conectados',
        'Priorizar reparación de sellos en refrigeración antes de verano',
        'Evaluar arrendamiento de equipos eficientes vs reparar viejos',
        'Instalar protector de voltaje en equipos críticos para evitar daños',
      ],
      HABITS: [
        'Reducir duchas a cinco minutos como máximo inmediato',
        'Desplazar lavado, plancha y cocina intensa fuera del pico',
        'Apagar todo equipo no esencial al salir de casa',
        'Establecer tope diario de horas de entretenimiento eléctrico',
        'Revisar factura semanal y fijar meta de reducción del 15%',
        'Limitar cantidad de dispositivos cargando simultáneamente',
        'Evitar dormir con AA a temperatura muy baja',
        'Involucrar a todos con checklist diario de apagado',
        'Desconectar equipos que permanecen encendidos 24/7 sin necesidad',
        'Usar ventilación natural cuando la calidad del aire lo permita',
        'Priorizar una auditoría energética domiciliaria profesional',
        'Registrar hábitos diarios que más impactan la factura',
      ],
      TECH: [
        'Instalar medidor de enchufe en los cinco equipos más sospechosos',
        'Configurar smart plugs para apagar standby masivo nocturno',
        'Retirar dispositivos IoT duplicados o sin uso',
        'Migrar entretenimiento a una sola regleta maestra con apagado total',
        'Desactivar servidores caseros o NAS fuera de horario laboral',
        'Sustituir cargadores genéricos por versiones eficientes certificadas',
        'Limitar cantidad de hubs inteligentes encendidos permanentemente',
        'Activar modo ahorro agresivo en todos los equipos compatibles',
        'Auditar apps que mantienen hardware activo innecesariamente',
        'Consolidar cargadores en estación única con timer',
        'Planificar upgrade a domótica con métricas de retorno de inversión',
        'Eliminar dispositivos fantasma conectados a la red doméstica',
      ],
    },
    en: {
      CLIMATE: [
        'Urgently review HVAC units with rising consumption',
        'Replace old low-SEER units with efficient models',
        'Prioritize insulation in rooms with highest thermal loss',
        'Limit AC hours to strict blocks during peak tariff',
        'Find and seal air leaks on priority windows',
        'Avoid conditioning open or poorly sealed zones',
        'Use programmable thermostat with daily usage caps',
        'Request professional service if consumption does not drop',
        'Lower setpoint one degree per week until 24°C',
        'Install door/window sensor to shut AC when ventilating',
        'Never run AC simultaneously with electric heating',
        'Plan double-glazing investment in next renovation',
      ],
      LIGHTING: [
        'Replace all incandescent or halogen bulbs immediately',
        'Remove outdoor lighting left on all day unnecessarily',
        'Install motion sensors in all transit areas',
        'Reduce active light points in large areas',
        'Turn off decorative lighting until LED migration completes',
        'Check old ballasts causing excessive consumption',
        'Prioritize LED in high-use kitchen and bathrooms',
        'Use one central light source instead of many lamps',
        'Measure before and after mass LED upgrade',
        'Disable non-essential illuminated signs',
        'Schedule full outdoor light shutdown during daytime',
        'Check local lighting efficiency subsidy programs',
      ],
      EQUIPMENT: [
        'Replace 10+ year appliances with A-label or better',
        'Skip dryer on sunny days; use clothesline',
        'Do not run washer, oven and microwave at same time',
        'Review dedicated circuit for high-consumption gear',
        'Unplug second fridge or freezer if not essential',
        'Use water heater timer to limit heating hours',
        'Avoid iron and vacuum during peak electricity hours',
        'Consolidate cooking into one daily block',
        'Remove obsolete equipment still plugged in',
        'Fix refrigeration seals before summer priority',
        'Evaluate renting efficient gear vs repairing old units',
        'Install surge protector on critical appliances',
      ],
      HABITS: [
        'Cut showers to five minutes maximum immediately',
        'Shift laundry, ironing and heavy cooking off peak',
        'Turn off all non-essential gear when leaving home',
        'Set daily cap on electric entertainment hours',
        'Review weekly bill and target 15% reduction',
        'Limit simultaneous device charging count',
        'Avoid sleeping with AC at very low temperature',
        'Involve everyone with daily shutdown checklist',
        'Disconnect 24/7 equipment that is not needed',
        'Use natural ventilation when air quality allows',
        'Prioritize professional home energy audit',
        'Log daily habits that most impact the bill',
      ],
      TECH: [
        'Install plug meter on top five suspect devices',
        'Configure smart plugs for massive nightly standby cutoff',
        'Remove duplicate or unused IoT devices',
        'Move entertainment to one master strip with full shutdown',
        'Power down home servers or NAS outside work hours',
        'Replace generic chargers with certified efficient ones',
        'Limit always-on smart hubs count',
        'Enable aggressive power saving on all compatible gear',
        'Audit apps keeping hardware unnecessarily active',
        'Consolidate chargers on one timed station',
        'Plan smart home upgrade with ROI metrics',
        'Remove ghost devices connected to home network',
      ],
    },
  },
}

function buildLevel(level) {
  const prefix = PREFIXES[level]
  const keys = []
  for (const domain of DOMAINS) {
    for (let i = 1; i <= 12; i++) {
      keys.push(`${domain}_${prefix}_${String(i).padStart(2, '0')}`)
    }
  }
  const titlesByLang = {}
  for (const lang of ['es', 'en']) {
    titlesByLang[lang] = DOMAINS.flatMap((d) => TITLES[level][lang][d])
  }
  return { keys, titlesByLang }
}

const efficient = buildLevel('efficient')
const inefficient = buildLevel('inefficient')

const out = join(dirname(fileURLToPath(import.meta.url)), 'level-catalog-export.mjs')
const content = `// Auto-generated by generate-level-catalog.mjs
export const EFFICIENT_CATALOG_KEYS = ${JSON.stringify(efficient.keys, null, 2)}

export const EFFICIENT_TITLES_BY_LANG = ${JSON.stringify(efficient.titlesByLang, null, 2)}

export const INEFFICIENT_CATALOG_KEYS = ${JSON.stringify(inefficient.keys, null, 2)}

export const INEFFICIENT_TITLES_BY_LANG = ${JSON.stringify(inefficient.titlesByLang, null, 2)}
`
writeFileSync(out, content, 'utf8')
console.log('Wrote', out, 'efficient', efficient.keys.length, 'inefficient', inefficient.keys.length)
