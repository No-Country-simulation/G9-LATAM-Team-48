import { formatMonthLabel } from './monthLabels'

export const PERIOD_ALL = 'all'
export const PERIOD_LAST_3 = 'last3'
export const PERIOD_LAST_6 = 'last6'

export const METRIC_KWH = 'kwh'
export const METRIC_COST = 'cost'
export const METRIC_BOTH = 'both'

export const TIPO_INMUEBLE_ALL = 'all'

export const DASHBOARD_TIPO_OPTIONS = [
  'APARTAMENTO',
  'CASA_UNIFAMILIAR',
  'PEQUENO_ESTABLECIMIENTO_COMERCIAL',
]

export const DEFAULT_DASHBOARD_FILTERS = {
  period: PERIOD_ALL,
  metric: METRIC_BOTH,
  /** Vacío = todos los tipos; uno o más = OR entre tipos seleccionados. */
  tiposInmueble: [],
}

export function normalizeTiposInmueble(raw) {
  if (raw == null) return []
  if (typeof raw === 'string') {
    if (!raw || raw === TIPO_INMUEBLE_ALL) return []
    return raw
      .split(',')
      .map((k) => k.trim())
      .filter((k) => DASHBOARD_TIPO_OPTIONS.includes(k))
  }
  if (Array.isArray(raw)) {
    return raw.filter((k) => DASHBOARD_TIPO_OPTIONS.includes(k))
  }
  return []
}

export function tiposInmuebleQueryValue(tipos) {
  const list = normalizeTiposInmueble(tipos)
  if (!list.length || list.length >= DASHBOARD_TIPO_OPTIONS.length) return null
  return [...list].sort().join(',')
}

export function hasActiveTiposInmuebleFilter(filters) {
  const list = normalizeTiposInmueble(filters?.tiposInmueble ?? filters?.tipoInmueble)
  return list.length > 0 && list.length < DASHBOARD_TIPO_OPTIONS.length
}

export function tiposInmuebleFetchKey(filters) {
  return tiposInmuebleQueryValue(filters?.tiposInmueble ?? filters?.tipoInmueble)
}

export function sliceByPeriod(items, period) {
  if (!items?.length) return []
  if (period === PERIOD_ALL) return items
  const count = period === PERIOD_LAST_3 ? 3 : period === PERIOD_LAST_6 ? 6 : items.length
  return items.slice(-count)
}

export function filterConsumos(consumos, period) {
  return sliceByPeriod(consumos ?? [], period)
}

/** Recorta listas paralelas del overview de analytics. */
export function filterAnalyticsOverview(analytics, period) {
  if (!analytics?.months?.length) {
    return analytics
  }
  const len = analytics.months.length
  let start = 0
  if (period === PERIOD_LAST_3) start = Math.max(0, len - 3)
  else if (period === PERIOD_LAST_6) start = Math.max(0, len - 6)

  const slice = (arr) => (Array.isArray(arr) ? arr.slice(start) : arr)

  return {
    ...analytics,
    months: slice(analytics.months),
    actualKwh: slice(analytics.actualKwh),
    predictedKwh: slice(analytics.predictedKwh),
    peakKwh: slice(analytics.peakKwh),
    offPeakKwh: slice(analytics.offPeakKwh),
    cost: slice(analytics.cost),
  }
}

/**
 * @param {Array<{ mes: string, consumo?: number, costo?: number }>} rows
 * @param {'consumo'|'costo'} valueKey
 */
export function buildVariationSeries(rows, valueKey = 'consumo') {
  if (!rows?.length) return []

  return rows.map((item, index) => {
    const current = Number(item[valueKey])
    const prevRaw = index > 0 ? Number(rows[index - 1][valueKey]) : NaN
    let variacionPct = null
    if (index > 0 && !Number.isNaN(prevRaw) && prevRaw > 0 && !Number.isNaN(current)) {
      variacionPct = Math.round(((current - prevRaw) / prevRaw) * 1000) / 10
    }
    return {
      mesKey: item.mes,
      value: current,
      variacionPct,
    }
  })
}

export function mapConsumosChartRows(consumos, t, locale) {
  return (consumos ?? []).map((item) => ({
    mesKey: item.mes,
    mes: formatMonthLabel(t, item.mes, 'short', locale),
    mesFull: formatMonthLabel(t, item.mes, 'full', locale),
    consumo: Number(item.consumo),
    costo: Number(item.costo),
  }))
}

export function variationValueKey(metric) {
  return metric === METRIC_COST ? 'costo' : 'consumo'
}

export function showKwhCharts(metric) {
  return metric === METRIC_KWH || metric === METRIC_BOTH
}

export function showCostCharts(metric) {
  return metric === METRIC_COST || metric === METRIC_BOTH
}

export function monthKeysFromConsumos(consumos) {
  return (consumos ?? []).map((item) => item.mes).filter(Boolean)
}
