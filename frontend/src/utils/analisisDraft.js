import { INSTALLATION_TYPES } from '../services/iaService'

const DRAFT_KEY = 'energia-analisis-draft'

const emptyDraft = {
  tipoInmueble: INSTALLATION_TYPES.CASA_UNIFAMILIAR,
  consumoKwh: '',
  cantidadPersonas: '',
  cantidadEquipos: '',
  areaM2: '',
  horasClimatizacion: '',
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
  const tipo = String(
    pick(nested, ['tipoInmueble', 'tipo_inmueble', 'tipo'], emptyDraft.tipoInmueble),
  ).toUpperCase()

  return {
    tipoInmueble: INSTALLATION_TYPES[tipo] || tipo || emptyDraft.tipoInmueble,
    consumoKwh: String(pick(nested, ['consumoKwh', 'consumo_kwh', 'consumo'], '')),
    cantidadPersonas: String(
      pick(nested, ['cantidadPersonas', 'cantidad_personas', 'personas'], ''),
    ),
    cantidadEquipos: String(
      pick(nested, ['cantidadEquipos', 'cantidad_equipos', 'equipos'], ''),
    ),
    areaM2: String(pick(nested, ['areaM2', 'area_m2', 'area'], '')),
    horasClimatizacion: String(
      pick(nested, ['horasClimatizacion', 'horas_climatizacion', 'climateHours'], ''),
    ),
    horasAltoConsumo: String(
      pick(nested, ['horasAltoConsumo', 'horas_alto_consumo', 'peakUseHours'], ''),
    ),
    usoHorarioPico: asBool(pick(nested, ['usoHorarioPico', 'uso_horario_pico'], false)),
  }
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

export { emptyDraft }
