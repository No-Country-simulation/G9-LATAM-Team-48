import { BENCHMARKS_KWH } from '../services/iaService'
import {
  DASHBOARD_TIPO_OPTIONS,
  normalizeTiposInmueble,
} from './dashboardChartFilters'

const REF_KWH = BENCHMARKS_KWH.CASA_UNIFAMILIAR

/** Factor vs casa unifamiliar (promedio si hay varios tipos). */
export function tipoInmuebleScaleFactor(tiposInmueble) {
  const list = normalizeTiposInmueble(tiposInmueble)
  if (!list.length || list.length >= DASHBOARD_TIPO_OPTIONS.length) {
    return 1
  }
  let sum = 0
  for (const key of list) {
    const kwh = BENCHMARKS_KWH[key]
    sum += kwh && REF_KWH ? kwh / REF_KWH : 1
  }
  return sum / list.length
}

export function scaleConsumosByTipo(rows, tiposInmueble) {
  const factor = tipoInmuebleScaleFactor(tiposInmueble)
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

export function scaleAnalyticsByTipo(analytics, tiposInmueble) {
  const factor = tipoInmuebleScaleFactor(tiposInmueble)
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

export function filterBreakdownByTipo(breakdown, tiposInmueble) {
  if (!breakdown?.items?.length) return breakdown
  const list = normalizeTiposInmueble(tiposInmueble)
  if (!list.length || list.length >= DASHBOARD_TIPO_OPTIONS.length) return breakdown
  const segments = new Set(list.map((k) => SEGMENT_BY_TIPO[k]).filter(Boolean))
  const items = breakdown.items.filter((item) => segments.has(item.segment))
  return { ...breakdown, items: items.length ? items : breakdown.items }
}
