/**
 * Espejo de `HeuristicPrediction.java` (backend). Si cambia una regla allá,
 * hay que replicarla acá para que el fallback local no contradiga a la API.
 */

export const INSTALLATION_TYPES = {
  APARTAMENTO: 'APARTAMENTO',
  CASA_UNIFAMILIAR: 'CASA_UNIFAMILIAR',
  PEQUENO_ESTABLECIMIENTO_COMERCIAL: 'PEQUENO_ESTABLECIMIENTO_COMERCIAL',
}

/** Typical monthly kWh reference by property type */
export const BENCHMARKS_KWH = {
  APARTAMENTO: 220,
  CASA_UNIFAMILIAR: 300,
  PEQUENO_ESTABLECIMIENTO_COMERCIAL: 650,
}

const COMERCIAL = INSTALLATION_TYPES.PEQUENO_ESTABLECIMIENTO_COMERCIAL

function toNumber(value, fallback) {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback
  }
  const text = String(value).trim()
  if (text === '') return fallback
  const parsed = Number(text)
  return Number.isFinite(parsed) ? parsed : fallback
}

/** Toma la primera clave presente y no nula, igual que `firstDouble` del backend. */
function firstNumber(datos, fallback, ...keys) {
  for (const key of keys) {
    if (key in datos && datos[key] !== null && datos[key] !== undefined) {
      return toNumber(datos[key], fallback)
    }
  }
  return fallback
}

function asBoolean(value) {
  if (typeof value === 'boolean') return value
  if (value === null || value === undefined) return null
  const text = String(value).trim().toLowerCase()
  if (text === 'true' || text === '1' || text === 'yes' || text === 'si') return true
  if (text === 'false' || text === '0' || text === 'no') return false
  return null
}

function normalizeTipo(tipoInmueble) {
  const raw = tipoInmueble ?? INSTALLATION_TYPES.CASA_UNIFAMILIAR
  const tipo = String(raw).trim()

  switch (tipo.toLowerCase()) {
    case 'casa':
    case 'casa_unifamiliar':
      return INSTALLATION_TYPES.CASA_UNIFAMILIAR
    case 'apartamento':
    case 'departamento':
      return INSTALLATION_TYPES.APARTAMENTO
    case 'pequeno_establecimiento_comercial':
    case 'pequeño_establecimiento_comercial':
    case 'comercio':
    case 'local_comercial':
      return COMERCIAL
    default:
      return tipo.toUpperCase()
  }
}

function defaultPersonas(tipo) {
  return tipo === INSTALLATION_TYPES.APARTAMENTO ? 2 : 3
}

function defaultArea(tipo) {
  return tipo === INSTALLATION_TYPES.APARTAMENTO ? 55 : 80
}

function readFeatures(datos = {}) {
  const tipo = normalizeTipo(datos.tipoInmueble ?? datos.tipo)

  return {
    tipo,
    consumo: firstNumber(datos, 0, 'consumoKwh', 'consumo'),
    personas: firstNumber(datos, defaultPersonas(tipo), 'cantidadPersonas', 'personas'),
    area: firstNumber(datos, defaultArea(tipo), 'areaM2', 'area'),
    climate: firstNumber(datos, 2, 'horasClimatizacion', 'climateHours'),
    equipos: firstNumber(datos, 0, 'cantidadEquipos', 'equipos'),
    horasAlto: firstNumber(datos, 0, 'horasAltoConsumo', 'peakUseHours'),
    usoPico: asBoolean(datos.usoHorarioPico) === true,
  }
}

function benchmarkFor({ tipo, personas, area, climate }) {
  const base = BENCHMARKS_KWH[tipo] ?? BENCHMARKS_KWH.CASA_UNIFAMILIAR
  const personFactor = tipo === COMERCIAL ? 70 : 55
  const areaFactor = tipo === COMERCIAL ? 2.2 : 1.2

  return Math.round(base * 0.45 + personas * personFactor + area * areaFactor + climate * 25)
}

/** Penaliza hábitos de consumo, no solo el total mensual. */
function habitScoreFor({ consumo, usoPico, horasAlto, equipos }) {
  let score = 0

  if (consumo >= 500) {
    score += 2
  } else if (consumo >= 250) {
    score += 1
  }
  if (usoPico) score += 1
  if (horasAlto >= 8) score += 1
  if (equipos >= 10) score += 1

  return score
}

function tipsFor(nivelKey, { tipo, usoPico, horasAlto, equipos, climate }) {
  const tips = new Set()
  const comercial = tipo === COMERCIAL

  if (nivelKey === 'efficient') {
    tips.add('keep')
    tips.add('monitor')
    if (climate >= 4) tips.add('ac')
  } else if (nivelKey === 'inefficient') {
    tips.add(comercial ? 'schedules' : 'ac')
    tips.add('replace')
    tips.add('peak')
    tips.add(comercial ? 'led' : 'standby')
  } else {
    tips.add('led')
    tips.add('peak')
    tips.add('appliances')
  }

  if (usoPico || horasAlto >= 5) {
    tips.add('peak')
    tips.add('standby')
  }
  if (equipos >= 10) tips.add('replace')
  if (climate >= 6) tips.add('insulation')

  return [...tips].slice(0, 5)
}

export function getBenchmark(tipoInmueble, datos = {}) {
  return benchmarkFor(readFeatures({ ...datos, tipoInmueble: tipoInmueble ?? datos.tipoInmueble }))
}

export function analizarConsumo(datos) {
  const features = readFeatures(datos)
  const benchmark = benchmarkFor(features)
  const ratio = benchmark <= 0 ? 1 : features.consumo / benchmark
  const habitScore = habitScoreFor(features)

  let nivelKey
  let ahorro
  let confidence

  if (ratio <= 0.85 && habitScore <= 1) {
    nivelKey = 'efficient'
    ahorro = 5
    confidence = 0.72
  } else if (ratio > 1.15 || habitScore >= 3) {
    nivelKey = 'inefficient'
    ahorro = habitScore >= 4 ? 32 : 28
    confidence = 0.74
  } else {
    nivelKey = 'moderate'
    ahorro = 15
    confidence = 0.68
  }

  return {
    nivelKey,
    category: nivelKey,
    ahorro,
    confidence,
    tipKeys: tipsFor(nivelKey, features),
    benchmark,
  }
}
