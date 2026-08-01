import {
  ML_REQUEST_FIELD_DEFS,
  pickRequestFieldValue,
  ZONA_INMUEBLE,
  AISLAMIENTO_TERMICO,
} from './analisisMlContract'

function normalizeRequestJson(raw) {
  if (raw == null || raw === '') return {}
  if (typeof raw === 'string') {
    try {
      return normalizeRequestJson(JSON.parse(raw))
    } catch {
      return {}
    }
  }
  if (typeof raw !== 'object' || Array.isArray(raw)) return {}
  return raw
}

export function getRequestFromRow(row) {
  return normalizeRequestJson(row?.requestJson ?? row?.request_json)
}

function defForFormKey(formKey) {
  return ML_REQUEST_FIELD_DEFS.find((f) => f.formKey === formKey)
}

export function numericFromRow(row, formKey) {
  const field = defForFormKey(formKey)
  if (!field) return null
  const value = pickRequestFieldValue(getRequestFromRow(row), field)
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

function enumLabel(map, raw, t, prefix) {
  if (raw == null || raw === '') return '—'
  const text = String(raw).trim()
  const fromLabel = Object.entries(map).find(([, label]) => label === text)
  const key = fromLabel ? fromLabel[0] : text.toUpperCase().replace(/\s+/g, '_')
  const i18nKey = `${prefix}.${key}`
  const translated = t(i18nKey)
  return translated === i18nKey ? text : translated
}

export function zonaLabelFromRow(row, t) {
  const field = defForFormKey('zona')
  const raw = field ? pickRequestFieldValue(getRequestFromRow(row), field) : null
  return enumLabel(ZONA_INMUEBLE, raw, t, 'analysis.zona')
}

export function aislamientoLabelFromRow(row, t) {
  const field = defForFormKey('aislamientoTermico')
  const raw = field ? pickRequestFieldValue(getRequestFromRow(row), field) : null
  return enumLabel(AISLAMIENTO_TERMICO, raw, t, 'analysis.aislamiento')
}

export function formatKwh(value) {
  if (value == null) return '—'
  return `${value} kWh`
}

export function formatM2(value) {
  if (value == null) return '—'
  return `${value} m²`
}
