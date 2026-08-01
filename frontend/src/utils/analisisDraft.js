import { INSTALLATION_TYPES } from '../services/iaService'
import {
  AISLAMIENTO_TERMICO,
  ZONA_INMUEBLE,
  pickRequestFieldValue,
  ML_REQUEST_FIELD_DEFS,
  resolveTipoInmuebleKey,
} from './analisisMlContract'

const DRAFT_KEY = 'energia-analisis-draft'

export const emptyDraft = {
  tipoInmueble: INSTALLATION_TYPES.CASA_UNIFAMILIAR,
  consumoKwh: '',
  consumoKwhMesAnterior: '',
  cantidadPersonas: '',
  cantidadEquipos: '',
  areaM2: '',
  horasClimatizacion: '',
  aislamientoTermico: 'REGULAR',
  pctIluminacionLed: '',
  antiguedadConstruccionAnios: '',
  zona: 'URBANA_INTERIOR',
  antiguedadElectrodomesticosAnios: '',
  horasAltoConsumo: '',
  usoHorarioPico: false,
}

function pick(raw, aliases, fallback = '') {
  for (const key of aliases) {
    if (raw[key] !== undefined && raw[key] !== null && raw[key] !== '') {
      return raw[key]
    }
  }
  return fallback
}

function asBool(value) {
  if (typeof value === 'boolean') return value
  const text = String(value ?? '')
    .trim()
    .toLowerCase()
  return text === 'true' || text === '1' || text === 'si' || text === 'yes'
}

function normalizeAislamientoKey(raw) {
  const text = String(raw ?? '').trim()
  if (!text) return emptyDraft.aislamientoTermico
  const upper = text.toUpperCase()
  if (AISLAMIENTO_TERMICO[upper]) return upper
  const fromLabel = Object.entries(AISLAMIENTO_TERMICO).find(([, v]) => v === text)
  return fromLabel ? fromLabel[0] : upper
}

function normalizeZonaKey(raw) {
  const text = String(raw ?? '').trim()
  if (!text) return emptyDraft.zona
  const upper = text.toUpperCase().replace(/\s+/g, '_')
  if (ZONA_INMUEBLE[upper]) return upper
  const fromLabel = Object.entries(ZONA_INMUEBLE).find(([, v]) => v === text)
  return fromLabel ? fromLabel[0] : upper
}

/** Normaliza requestJson / payload a la forma del formulario de Análisis IA. */
export function draftFromRequest(raw = {}) {
  const source =
    typeof raw === 'string'
      ? (() => {
          try {
            return JSON.parse(raw)
          } catch {
            return {}
          }
        })()
      : raw && typeof raw === 'object'
        ? raw
        : {}

  const nested = source.features || source.payload || source
  const tipo = resolveTipoInmuebleKey(
    pick(nested, ['tipoInmueble', 'tipo_inmueble', 'tipo'], emptyDraft.tipoInmueble),
  )

  const draft = { ...emptyDraft, tipoInmueble: INSTALLATION_TYPES[tipo] || tipo || emptyDraft.tipoInmueble }

  for (const field of ML_REQUEST_FIELD_DEFS) {
    const value = pickRequestFieldValue(nested, field)
    if (value === undefined) continue
    if (field.formKey === 'aislamientoTermico') {
      draft.aislamientoTermico = normalizeAislamientoKey(value)
    } else if (field.formKey === 'zona') {
      draft.zona = normalizeZonaKey(value)
    } else {
      draft[field.formKey] = String(value)
    }
  }

  draft.horasAltoConsumo = String(
    pick(nested, ['horasAltoConsumo', 'horas_alto_consumo', 'peakUseHours'], ''),
  )
  draft.usoHorarioPico = asBool(pick(nested, ['usoHorarioPico', 'uso_horario_pico'], false))

  return draft
}

export function saveAnalisisDraft(datos) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(datos))
  } catch {
    // ignore quota / private mode
  }
}

/** Lee y borra el borrador (one-shot). */
export function consumeAnalisisDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    sessionStorage.removeItem(DRAFT_KEY)
    return draftFromRequest(JSON.parse(raw))
  } catch {
    return null
  }
}
