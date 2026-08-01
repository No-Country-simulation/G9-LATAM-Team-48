import {
  AISLAMIENTO_TERMICO,
  ALL_REQUEST_FIELD_DEFS,
  ML_REQUEST_FIELD_DEFS,
  ML_TIPO_INMUEBLE,
  ZONA_INMUEBLE,
  pickRequestFieldValue,
  resolveTipoInmuebleKey,
} from '../utils/analisisMlContract'
import { INSTALLATION_TYPES } from '../services/iaService'

function reverseLookup(map, value) {
  if (value == null || value === '') return null
  const text = String(value).trim()
  const entry = Object.entries(map).find(([, label]) => label === text)
  if (entry) return entry[0]
  const upper = text.toUpperCase()
  if (map[upper]) return upper
  return text
}

export function formatAnalysisFieldValue(t, field, raw) {
  if (raw == null || raw === '') return '—'

  if (field.type === 'tipoMl' || field.type === 'tipo') {
    const key = resolveTipoInmuebleKey(raw)
    const mlLabel = ML_TIPO_INMUEBLE[key]
    if (mlLabel) return mlLabel
    const i18nKey = `analysis.types.${key}`
    const translated = t(i18nKey)
    return translated === i18nKey ? String(raw) : translated
  }

  if (field.type === 'aislamiento') {
    const key = reverseLookup(AISLAMIENTO_TERMICO, raw) || String(raw).toUpperCase()
    const i18nKey = `analysis.aislamiento.${key}`
    const translated = t(i18nKey)
    return translated === i18nKey ? String(raw) : translated
  }

  if (field.type === 'zona') {
    const key = reverseLookup(ZONA_INMUEBLE, raw) || String(raw).toUpperCase()
    const i18nKey = `analysis.zona.${key}`
    const translated = t(i18nKey)
    return translated === i18nKey ? String(raw) : translated
  }

  if (field.type === 'bool') {
    return raw === true || raw === 'true' || raw === 1 || raw === '1'
      ? t('analysis.yesNo.yes')
      : t('analysis.yesNo.no')
  }

  if (field.type === 'number') {
    const num = Number(raw)
    const text = Number.isFinite(num) ? String(num) : String(raw)
    return field.suffix ? `${text} ${field.suffix}` : text
  }

  return String(raw)
}

/**
 * Tabla de datos ingresados al modelo (12 campos ML + opcionales legacy).
 */
export default function AnalysisRequestFieldsTable({
  request,
  t,
  showLegacy = true,
  showMlKey = false,
}) {
  const normalized = request && typeof request === 'object' ? request : {}
  const fields = showLegacy ? ALL_REQUEST_FIELD_DEFS : ML_REQUEST_FIELD_DEFS

  return (
    <div className="table-responsive">
      <table className="table table-sm table-striped align-middle mb-0">
        <thead>
          <tr>
            <th>{t('analysis.requestTable.field', 'Campo')}</th>
            {showMlKey && (
              <th className="text-muted small">{t('analysis.requestTable.jsonKey', 'Clave JSON')}</th>
            )}
            <th>{t('analysis.requestTable.value', 'Valor')}</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => {
            const value = pickRequestFieldValue(normalized, field)
            if (value === undefined && field.legacy) return null
            return (
              <tr key={field.mlKey || field.formKey}>
                <td className="small">
                  {t(field.labelKey)}
                  {field.legacy && (
                    <span className="text-muted ms-1">
                      ({t('analysis.legacyFieldTag', 'no usado por el modelo')})
                    </span>
                  )}
                </td>
                {showMlKey && (
                  <td className="small text-muted font-monospace">{field.mlKey}</td>
                )}
                <td className="fw-semibold small">
                  {formatAnalysisFieldValue(t, field, value)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export { ML_TIPO_INMUEBLE, INSTALLATION_TYPES }
