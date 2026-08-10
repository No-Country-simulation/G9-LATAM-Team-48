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

function firstNumber(datos, fallback, ...keys) {
  for (const key of keys) {
    if (key in datos && datos[key] !== null && datos[key] !== undefined) {
      return toNumber(datos[key], fallback)
    }
  }
  return fallback
}

function normalizeTipo(tipoInmueble) {
  const raw = tipoInmueble ?? INSTALLATION_TYPES.CASA_UNIFAMILIAR
  const tipo = String(raw).trim()

  switch (tipo.toLowerCase()) {
    case 'casa':
    case 'casa_unifamiliar':
    case 'casa unifamiliar':
      return INSTALLATION_TYPES.CASA_UNIFAMILIAR
    case 'apartamento':
    case 'departamento':
      return INSTALLATION_TYPES.APARTAMENTO
    case 'pequeno_establecimiento_comercial':
    case 'pequeño_establecimiento_comercial':
    case 'pequeño establecimiento comercial':
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
    consumo: firstNumber(datos, 0, 'consumo_kwh_mensual', 'consumoKwh', 'consumo'),
    personas: firstNumber(datos, defaultPersonas(tipo), 'num_personas', 'cantidadPersonas', 'personas'),
    area: firstNumber(datos, defaultArea(tipo), 'superficie_m2', 'areaM2', 'area'),
    climate: firstNumber(datos, 2, 'horas_uso_aa_dia', 'horasClimatizacion', 'climateHours'),
  }
}

function benchmarkFor({ tipo, personas, area, climate }) {
  const base = BENCHMARKS_KWH[tipo] ?? BENCHMARKS_KWH.CASA_UNIFAMILIAR
  const personFactor = tipo === COMERCIAL ? 70 : 55
  const areaFactor = tipo === COMERCIAL ? 2.2 : 1.2

  return Math.round(base * 0.45 + personas * personFactor + area * areaFactor + climate * 25)
}

export function getBenchmark(tipoInmueble, datos = {}) {
  return benchmarkFor(readFeatures({ ...datos, tipoInmueble: tipoInmueble ?? datos.tipoInmueble }))
}
