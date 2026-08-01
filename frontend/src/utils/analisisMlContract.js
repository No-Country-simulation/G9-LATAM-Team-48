import { INSTALLATION_TYPES } from '../services/iaService'

/** Valores exactos que espera el modelo (snake_case en API ML). */
export const ML_TIPO_INMUEBLE = {
  [INSTALLATION_TYPES.APARTAMENTO]: 'Apartamento',
  [INSTALLATION_TYPES.CASA_UNIFAMILIAR]: 'Casa Unifamiliar',
  [INSTALLATION_TYPES.PEQUENO_ESTABLECIMIENTO_COMERCIAL]: 'Pequeño Establecimiento Comercial',
}

export const AISLAMIENTO_TERMICO = {
  BUENO: 'Bueno',
  MALO: 'Malo',
  REGULAR: 'Regular',
}

export const ZONA_INMUEBLE = {
  SUBURBANA: 'Suburbana',
  URBANA_COSTERA: 'Urbana Costera',
  URBANA_INTERIOR: 'Urbana Interior',
}

/** Campos del contrato ML (orden estable para tablas admin / historial). */
export const ML_REQUEST_FIELD_DEFS = [
  {
    mlKey: 'tipo_inmueble',
    formKey: 'tipoInmueble',
    labelKey: 'analysis.installationType',
    type: 'tipoMl',
    aliases: ['tipo_inmueble', 'tipoInmueble', 'tipo'],
  },
  {
    mlKey: 'superficie_m2',
    formKey: 'areaM2',
    labelKey: 'analysis.homeArea',
    type: 'number',
    suffix: 'm²',
    aliases: ['superficie_m2', 'areaM2', 'area_m2', 'area'],
  },
  {
    mlKey: 'num_personas',
    formKey: 'cantidadPersonas',
    labelKey: 'analysis.people',
    type: 'number',
    aliases: ['num_personas', 'cantidadPersonas', 'cantidad_personas', 'personas'],
  },
  {
    mlKey: 'cantidad_equipos_total',
    formKey: 'cantidadEquipos',
    labelKey: 'analysis.devices',
    type: 'number',
    aliases: ['cantidad_equipos_total', 'cantidadEquipos', 'cantidad_equipos', 'equipos'],
  },
  {
    mlKey: 'horas_uso_aa_dia',
    formKey: 'horasClimatizacion',
    labelKey: 'analysis.acHoursDay',
    type: 'number',
    aliases: ['horas_uso_aa_dia', 'horasClimatizacion', 'horas_climatizacion', 'climateHours'],
  },
  {
    mlKey: 'consumo_kwh_mensual',
    formKey: 'consumoKwh',
    labelKey: 'analysis.monthlyUsage',
    type: 'number',
    suffix: 'kWh',
    aliases: ['consumo_kwh_mensual', 'consumoKwh', 'consumo_kwh', 'consumo'],
  },
  {
    mlKey: 'consumo_kwh_mes_anterior',
    formKey: 'consumoKwhMesAnterior',
    labelKey: 'analysis.previousMonthUsage',
    type: 'number',
    suffix: 'kWh',
    aliases: ['consumo_kwh_mes_anterior', 'consumoKwhMesAnterior'],
  },
  {
    mlKey: 'aislamiento_termico',
    formKey: 'aislamientoTermico',
    labelKey: 'analysis.thermalInsulation',
    type: 'aislamiento',
    aliases: ['aislamiento_termico', 'aislamientoTermico'],
  },
  {
    mlKey: 'pct_iluminacion_led',
    formKey: 'pctIluminacionLed',
    labelKey: 'analysis.ledLightingPct',
    type: 'number',
    suffix: '%',
    aliases: ['pct_iluminacion_led', 'pctIluminacionLed'],
  },
  {
    mlKey: 'antiguedad_construccion_anios',
    formKey: 'antiguedadConstruccionAnios',
    labelKey: 'analysis.buildingAgeYears',
    type: 'number',
    aliases: ['antiguedad_construccion_anios', 'antiguedadConstruccionAnios'],
  },
  {
    mlKey: 'zona',
    formKey: 'zona',
    labelKey: 'analysis.zone',
    type: 'zona',
    aliases: ['zona'],
  },
  {
    mlKey: 'antiguedad_electrodomesticos_anios',
    formKey: 'antiguedadElectrodomesticosAnios',
    labelKey: 'analysis.applianceAgeYears',
    type: 'number',
    aliases: ['antiguedad_electrodomesticos_anios', 'antiguedadElectrodomesticosAnios'],
  },
]

export const LEGACY_REQUEST_FIELD_DEFS = [
  {
    mlKey: 'horasAltoConsumo',
    formKey: 'horasAltoConsumo',
    labelKey: 'analysis.peakUseHours',
    type: 'number',
    legacy: true,
    aliases: ['horasAltoConsumo', 'horas_alto_consumo', 'peakUseHours'],
  },
  {
    mlKey: 'usoHorarioPico',
    formKey: 'usoHorarioPico',
    labelKey: 'analysis.peakHoursUse',
    type: 'bool',
    legacy: true,
    aliases: ['usoHorarioPico', 'uso_horario_pico'],
  },
]

export const ALL_REQUEST_FIELD_DEFS = [...ML_REQUEST_FIELD_DEFS, ...LEGACY_REQUEST_FIELD_DEFS]

export function resolveTipoInmuebleKey(raw) {
  if (!raw) return INSTALLATION_TYPES.CASA_UNIFAMILIAR
  const text = String(raw).trim()
  const upper = text.toUpperCase()
  if (INSTALLATION_TYPES[upper]) return upper
  const fromMl = Object.entries(ML_TIPO_INMUEBLE).find(([, label]) => label === text)
  if (fromMl) return fromMl[0]
  return upper
}

export function pickRequestFieldValue(request, field) {
  const keys = field.aliases || [field.formKey, field.mlKey]
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(request, key)) continue
    const value = request[key]
    if (value !== undefined && value !== null && value !== '') return value
    if (value === 0 || value === false) return value
  }
  return undefined
}

/** Body camelCase para POST /api/analisis (Spring AnalisisPayload). */
export function buildAnalisisApiPayload(form) {
  return {
    tipoInmueble: form.tipoInmueble,
    areaM2: Number(form.areaM2) || 0,
    consumoKwh: Number(form.consumoKwh) || 0,
    consumoKwhMesAnterior: Number(form.consumoKwhMesAnterior) || 0,
    cantidadEquipos: Number(form.cantidadEquipos) || 0,
    cantidadPersonas: Number(form.cantidadPersonas) || 1,
    horasClimatizacion: Number(form.horasClimatizacion) || 0,
    aislamientoTermico: form.aislamientoTermico || AISLAMIENTO_TERMICO.REGULAR,
    pctIluminacionLed: Number(form.pctIluminacionLed) || 0,
    antiguedadConstruccionAnios: Number(form.antiguedadConstruccionAnios) || 0,
    zona: form.zona || ZONA_INMUEBLE.URBANA_INTERIOR,
    antiguedadElectrodomesticosAnios: Number(form.antiguedadElectrodomesticosAnios) || 0,
    horasAltoConsumo:
      form.horasAltoConsumo === '' || form.horasAltoConsumo == null
        ? null
        : Number(form.horasAltoConsumo),
    usoHorarioPico: Boolean(form.usoHorarioPico),
  }
}
