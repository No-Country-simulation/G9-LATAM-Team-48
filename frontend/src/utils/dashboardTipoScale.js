import { BENCHMARKS_KWH } from '../services/iaService'
import { TIPO_INMUEBLE_ALL } from './dashboardChartFilters'

const REF_KWH = BENCHMARKS_KWH.CASA_UNIFAMILIAR

/** Factor vs casa unifamiliar (benchmark de referencia del mock). */
export function tipoInmuebleScaleFactor(tipoInmueble) {
  if (!tipoInmueble || tipoInmueble === TIPO_INMUEBLE_ALL) {
    return 1
  }
  const kwh = BENCHMARKS_KWH[tipoInmueble]
  if (!kwh || !REF_KWH) return 1
  return kwh / REF_KWH
}

export function scaleConsumosByTipo(rows, tipoInmueble) {
  const factor = tipoInmuebleScaleFactor(tipoInmueble)
  if (factor === 1 || !rows?.length) return rows ?? []
  return rows.map((row) => ({
    ...row,
    consumo: Math.round(Number(row.consumo) * factor),
    costo: Math.round(Number(row.costo ?? 0) * factor),
  }))
}

function scaleNumbers(values, factor) {
  if (!Array.isArray(values) || factor === 1) return values
  return values.map((v) => Math.round(Number(v) * factor))
}

export function scaleAnalyticsByTipo(analytics, tipoInmueble) {
  const factor = tipoInmuebleScaleFactor(tipoInmueble)
  if (factor === 1 || !analytics) return analytics
  return {
    ...analytics,
    actualKwh: scaleNumbers(analytics.actualKwh, factor),
    predictedKwh: scaleNumbers(analytics.predictedKwh, factor),
    peakKwh: scaleNumbers(analytics.peakKwh, factor),
    offPeakKwh: scaleNumbers(analytics.offPeakKwh, factor),
    cost: scaleNumbers(analytics.cost, factor),
  }
}

const SEGMENT_BY_TIPO = {
  APARTAMENTO: 'Apartamento',
  CASA_UNIFAMILIAR: 'Casa Unifamiliar',
  PEQUENO_ESTABLECIMIENTO_COMERCIAL: 'Pequeño Establecimiento Comercial',
}

export function filterBreakdownByTipo(breakdown, tipoInmueble) {
  if (!breakdown?.items?.length) return breakdown
  if (!tipoInmueble || tipoInmueble === TIPO_INMUEBLE_ALL) return breakdown
  const segment = SEGMENT_BY_TIPO[tipoInmueble]
  if (!segment) return breakdown
  const items = breakdown.items.filter((item) => item.segment === segment)
  return { ...breakdown, items: items.length ? items : breakdown.items }
}
