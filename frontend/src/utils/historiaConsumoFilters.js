import { INSTALLATION_TYPES } from '../services/iaService'
import {
  ML_REQUEST_FIELD_DEFS,
  pickRequestFieldValue,
  resolveTipoInmuebleKey,
  ZONA_INMUEBLE,
} from './analisisMlContract'
import { getRequestFromRow } from './analisisRowHelpers'
import {
  DASHBOARD_TIPO_OPTIONS,
  hasActiveTiposInmuebleFilter,
  normalizeTiposInmueble,
} from './dashboardChartFilters'

export const HISTORIA_PERIOD_ALL = 'all'
export const HISTORIA_PERIOD_7 = 'last7'
export const HISTORIA_PERIOD_30 = 'last30'
export const HISTORIA_PERIOD_90 = 'last90'

export const HISTORIA_FILTER_ALL = 'all'

export const HISTORIA_NIVEL_OPTIONS = ['efficient', 'moderate', 'inefficient']

export const DEFAULT_HISTORIA_FILTERS = {
  period: HISTORIA_PERIOD_ALL,
  /** Vacío = todos los tipos (UI: 3 checkboxes marcados). */
  tiposInmueble: [],
  /** Vacío = todos los niveles (UI: 3 checkboxes marcados). */
  niveles: [],
}

export function normalizeNiveles(raw) {
  if (raw == null) return []
  if (typeof raw === 'string') {
    const single = String(raw).trim().toLowerCase()
    if (!single || single === HISTORIA_FILTER_ALL) return []
    return HISTORIA_NIVEL_OPTIONS.includes(single) ? [single] : []
  }
  if (Array.isArray(raw)) {
    return raw
      .map((k) => String(k).trim().toLowerCase())
      .filter((k) => HISTORIA_NIVEL_OPTIONS.includes(k))
  }
  return []
}

/** Checkboxes: vacío o los 3 = todos marcados en UI. */
export function nivelesUiSelection(raw) {
  const list = normalizeNiveles(raw)
  if (!list.length || list.length >= HISTORIA_NIVEL_OPTIONS.length) {
    return [...HISTORIA_NIVEL_OPTIONS]
  }
  return list
}

export function toggleNivelesSelection(currentRaw, key) {
  if (!HISTORIA_NIVEL_OPTIONS.includes(key)) {
    return normalizeNiveles(currentRaw)
  }
  const ui = nivelesUiSelection(currentRaw)
  const next = ui.includes(key) ? ui.filter((k) => k !== key) : [...ui, key]
  if (!next.length || next.length >= HISTORIA_NIVEL_OPTIONS.length) {
    return []
  }
  return [...next].sort()
}

export function hasActiveNivelesFilter(nivelesRaw) {
  const list = normalizeNiveles(nivelesRaw)
  return list.length > 0 && list.length < HISTORIA_NIVEL_OPTIONS.length
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

  const tipos = normalizeTiposInmueble(f.tiposInmueble)
  if (tipos.length > 0 && tipos.length < DASHBOARD_TIPO_OPTIONS.length) {
    const key = tipoKeyFromItem(item)
    if (!key || !tipos.includes(key)) return false
  } else if (f.tipo != null && f.tipo !== HISTORIA_FILTER_ALL) {
    if (tipoKeyFromItem(item) !== f.tipo) return false
  }

  if (f.zona != null && f.zona !== HISTORIA_FILTER_ALL) {
    if (zonaKeyFromItem(item) !== f.zona) return false
  }

  const niveles = normalizeNiveles(f.niveles ?? f.nivel)
  if (niveles.length > 0 && niveles.length < HISTORIA_NIVEL_OPTIONS.length) {
    const itemNivel = nivelKeyFromItem(item)
    if (!itemNivel || !niveles.includes(itemNivel)) return false
  } else if (f.nivel != null && f.nivel !== HISTORIA_FILTER_ALL && !f.niveles?.length) {
    if (nivelKeyFromItem(item) !== String(f.nivel).trim().toLowerCase()) return false
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
    hasActiveTiposInmuebleFilter({ tiposInmueble: f.tiposInmueble }) ||
    (f.tipo != null && f.tipo !== HISTORIA_FILTER_ALL) ||
    (f.zona != null && f.zona !== HISTORIA_FILTER_ALL) ||
    hasActiveNivelesFilter(f.niveles) ||
    (f.nivel != null && f.nivel !== HISTORIA_FILTER_ALL && !f.niveles?.length)
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
