/**
 * Metadatos de sugerencias (prioridad y foco) para la tabla de resultados.
 * Texto visible: recommendations.catalog (V2) o analysis.tipsList (claves cortas del motor).
 */
export const TIP_DISPLAY_META = {
  keep: { priority: 'low', focusKey: 'analysis.tipsFocus.habits' },
  monitor: { priority: 'low', focusKey: 'analysis.tipsFocus.monitoring' },
  led: { priority: 'high', focusKey: 'analysis.tipsFocus.lighting' },
  peak: { priority: 'high', focusKey: 'analysis.tipsFocus.peakHours' },
  appliances: { priority: 'medium', focusKey: 'analysis.tipsFocus.equipment' },
  ac: { priority: 'high', focusKey: 'analysis.tipsFocus.climate' },
  replace: { priority: 'high', focusKey: 'analysis.tipsFocus.equipment' },
  insulation: { priority: 'medium', focusKey: 'analysis.tipsFocus.envelope' },
  standby: { priority: 'medium', focusKey: 'analysis.tipsFocus.standby' },
  schedules: { priority: 'medium', focusKey: 'analysis.tipsFocus.schedules' },
  commercial: { priority: 'high', focusKey: 'analysis.tipsFocus.commercial' },
  house: { priority: 'medium', focusKey: 'analysis.tipsFocus.house' },
  apartment: { priority: 'medium', focusKey: 'analysis.tipsFocus.apartment' },
  shifts: { priority: 'medium', focusKey: 'analysis.tipsFocus.schedules' },
  default: { priority: 'medium', focusKey: 'analysis.tipsFocus.general' },
  night: { priority: 'low', focusKey: 'analysis.tipsFocus.habits' },
  solar: { priority: 'low', focusKey: 'analysis.tipsFocus.generation' },
}

const BASE_BY_NIVEL = {
  efficient: ['keep', 'monitor'],
  moderate: ['led', 'appliances', 'peak'],
  inefficient: ['replace', 'insulation', 'schedules'],
}

function nivelToCategory(nivelKey) {
  const n = String(nivelKey || 'moderate').toLowerCase()
  if (n === 'efficient') return 'BAJO'
  if (n === 'inefficient') return 'ALTO'
  return 'MODERADO'
}

function ruleTips(datos, nivelKey) {
  const tips = []
  const category = nivelToCategory(nivelKey)
  const pctLed = Number(datos.pctIluminacionLed ?? datos.pct_iluminacion_led)
  const aislamiento = String(datos.aislamientoTermico ?? datos.aislamiento_termico ?? '')
  const antElect = Number(datos.antiguedadElectrodomesticosAnios ?? datos.antiguedad_electrodomesticos_anios)
  const horasAa = Number(datos.horasClimatizacion ?? datos.horas_uso_aa_dia ?? 0)
  const equipos = Number(datos.cantidadEquipos ?? datos.cantidad_equipos_total ?? 0)
  const usoPico = Boolean(datos.usoHorarioPico)

  if (category === 'ALTO') tips.push('ac')
  if (category === 'MODERADO') tips.push('shifts')
  if (category === 'BAJO') {
    tips.push('keep', 'monitor')
  }
  if (Number.isFinite(pctLed) && pctLed < 55) tips.push('led')
  if (aislamiento && !/bueno/i.test(aislamiento)) tips.push('insulation')
  if (Number.isFinite(antElect) && antElect >= 8) tips.push('replace')
  if (horasAa >= 8) tips.push('ac')
  if (usoPico) tips.push('peak')
  if (equipos >= 12) tips.push('standby')
  if (datos.tipoInmueble === 'PEQUENO_ESTABLECIMIENTO_COMERCIAL') tips.push('commercial')
  if (datos.tipoInmueble === 'CASA_UNIFAMILIAR') tips.push('house')
  if (datos.tipoInmueble === 'APARTAMENTO') tips.push('apartment')

  return tips
}

/** Orquesta sugerencias según nivel + datos (fallback local alineado al backend). */
export function composeAnalysisTipKeys(nivelKey, datos = {}, existing = []) {
  const merged = new Set()
  for (const key of ruleTips(datos, nivelKey)) merged.add(key)
  for (const key of existing) merged.add(key)
  for (const key of BASE_BY_NIVEL[nivelKey] || BASE_BY_NIVEL.moderate) merged.add(key)
  if (merged.size === 0) merged.add('default')
  return [...merged].slice(0, 6)
}

export function tipMetaFor(key) {
  return TIP_DISPLAY_META[key] || TIP_DISPLAY_META.default
}
