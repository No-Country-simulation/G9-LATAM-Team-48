import { INSTALLATION_TYPES } from '../services/iaService'
import {
  ML_REQUEST_FIELD_DEFS,
  pickRequestFieldValue,
  resolveTipoInmuebleKey,
  ZONA_INMUEBLE,
} from './analisisMlContract'
import { getRequestFromRow } from './analisisRowHelpers'

export const HISTORIA_PERIOD_ALL = 'all'
export const HISTORIA_PERIOD_7 = 'last7'
export const HISTORIA_PERIOD_30 = 'last30'
export const HISTORIA_PERIOD_90 = 'last90'

export const HISTORIA_FILTER_ALL = 'all'

/** Máximo de niveles seleccionables a la vez en Historia de consumos. */
export const HISTORIA_NIVEL_MAX_SELECTED = 2

export const DEFAULT_HISTORIA_FILTERS = {
  period: HISTORIA_PERIOD_ALL,
  tipo: HISTORIA_FILTER_ALL,
  zona: HISTORIA_FILTER_ALL,
  /** Vacío = todos los niveles; uno o más = OR entre niveles seleccionados. */
  niveles: [],
}

function normalizeNivelesFilter(raw) {
  if (raw == null) return []
  if (Array.isArray(raw)) {
    return raw
      .map((k) => String(k).trim().toLowerCase())
      .filter(Boolean)
      .slice(0, HISTORIA_NIVEL_MAX_SELECTED)
  }
  const single = String(raw).trim().toLowerCase()
  if (!single || single === HISTORIA_FILTER_ALL) return []
  return [single]
}

function toDate(value) {
  if (value == null || value === '') return null
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }
  if (Array.isArray(value) && value.length >= 3) {
    const [y, m, d, h = 0, min = 0, s = 0] = value.map(Number)
    const date = new Date(y, m - 1, d, h, min, s)
    return Number.isNaN(date.getTime()) ? null : date
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function normalizeZonaKey(raw) {
  const text = String(raw ?? '').trim()
  if (!text) return null
  const upper = text.toUpperCase().replace(/\s+/g, '_')
  if (ZONA_INMUEBLE[upper]) return upper
  const fromLabel = Object.entries(ZONA_INMUEBLE).find(([, v]) => v === text)
  return fromLabel ? fromLabel[0] : upper
}

function zonaKeyFromItem(item) {
  if (item?.zona) {
    return normalizeZonaKey(item.zona)
  }
  const field = ML_REQUEST_FIELD_DEFS.find((f) => f.formKey === 'zona')
  const raw = field ? pickRequestFieldValue(getRequestFromRow(item), field) : null
  return raw != null ? normalizeZonaKey(raw) : null
}

function tipoKeyFromItem(item) {
  const raw =
    item?.tipoInstalacion ??
    pickRequestFieldValue(getRequestFromRow(item), ML_REQUEST_FIELD_DEFS[0])
  return resolveTipoInmuebleKey(raw)
}

function nivelKeyFromItem(item) {
  const key = String(item?.nivelKey ?? '').trim().toLowerCase()
  return key || null
}

function matchesPeriod(createdAt, period) {
  if (period === HISTORIA_PERIOD_ALL) return true
  const date = toDate(createdAt)
  if (!date) return true
  const now = Date.now()
  const days =
    period === HISTORIA_PERIOD_7 ? 7 : period === HISTORIA_PERIOD_30 ? 30 : 90
  const cutoff = now - days * 24 * 60 * 60 * 1000
  return date.getTime() >= cutoff
}

export function matchesHistoriaFilters(item, filters = DEFAULT_HISTORIA_FILTERS) {
  const f = filters ?? DEFAULT_HISTORIA_FILTERS
  if (!matchesPeriod(item?.createdAt, f.period)) return false

  if (f.tipo !== HISTORIA_FILTER_ALL) {
    if (tipoKeyFromItem(item) !== f.tipo) return false
  }

  if (f.zona !== HISTORIA_FILTER_ALL) {
    if (zonaKeyFromItem(item) !== f.zona) return false
  }

  const niveles = normalizeNivelesFilter(f.niveles ?? f.nivel)
  if (niveles.length > 0) {
    const itemNivel = nivelKeyFromItem(item)
    if (!itemNivel || !niveles.includes(itemNivel)) return false
  }

  return true
}

export function filterHistoriaItems(items, filters) {
  return (items ?? []).filter((item) => matchesHistoriaFilters(item, filters))
}

export function hasActiveHistoriaFilters(filters) {
  const f = filters ?? DEFAULT_HISTORIA_FILTERS
  return (
    f.period !== HISTORIA_PERIOD_ALL ||
    f.tipo !== HISTORIA_FILTER_ALL ||
    f.zona !== HISTORIA_FILTER_ALL ||
    normalizeNivelesFilter(f.niveles ?? f.nivel).length > 0
  )
}

export function consumoFromHistoriaItem(item) {
  const direct = item?.consumoKwh ?? item?.consumo
  const num = Number(direct)
  if (Number.isFinite(num)) return num
  const field = ML_REQUEST_FIELD_DEFS.find((f) => f.formKey === 'consumoKwh')
  const raw = field ? pickRequestFieldValue(getRequestFromRow(item), field) : null
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : null
}

export function calcHistoriaKpis(items) {
  const list = items ?? []
  const consumos = list.map(consumoFromHistoriaItem).filter((v) => v != null)
  const ahorros = list
    .map((item) => item?.ahorro)
    .filter((v) => v != null && Number.isFinite(Number(v)))
    .map(Number)

  const count = list.length
  const avgKwh =
    consumos.length > 0
      ? Math.round(consumos.reduce((a, b) => a + b, 0) / consumos.length)
      : null
  const avgAhorro =
    ahorros.length > 0
      ? Math.round(ahorros.reduce((a, b) => a + b, 0) / ahorros.length)
      : null

  return { count, avgKwh, avgAhorro }
}

export const HISTORIA_TIPO_OPTIONS = Object.values(INSTALLATION_TYPES)

export const HISTORIA_ZONA_OPTIONS = Object.keys(ZONA_INMUEBLE)

export const HISTORIA_NIVEL_OPTIONS = ['efficient', 'moderate', 'inefficient']
