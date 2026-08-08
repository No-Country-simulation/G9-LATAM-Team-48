import { useLocale } from '../context/LocaleContext'
import {
  DEFAULT_HISTORIA_FILTERS,
  HISTORIA_FILTER_ALL,
  HISTORIA_NIVEL_OPTIONS,
  HISTORIA_PERIOD_30,
  HISTORIA_PERIOD_7,
  HISTORIA_PERIOD_90,
  HISTORIA_PERIOD_ALL,
  HISTORIA_TIPO_OPTIONS,
  HISTORIA_ZONA_OPTIONS,
  hasActiveHistoriaFilters,
  HISTORIA_NIVEL_MAX_SELECTED,
} from '../utils/historiaConsumoFilters'

export default function HistoriaConsumosFilters({ filters, onChange, onReset }) {
  const { t } = useLocale()
  const value = filters ?? DEFAULT_HISTORIA_FILTERS
  const active = hasActiveHistoriaFilters(value)

  const setField = (field, next) => {
    onChange?.({ ...value, [field]: next })
  }

  const selectedNiveles = value.niveles ?? []

  const toggleNivel = (key) => {
    const current = selectedNiveles
    if (current.includes(key)) {
      setField(
        'niveles',
        current.filter((k) => k !== key),
      )
      return
    }
    if (current.length >= HISTORIA_NIVEL_MAX_SELECTED) return
    setField('niveles', [...current, key])
  }

  const atNivelMax = selectedNiveles.length >= HISTORIA_NIVEL_MAX_SELECTED

  return (
    <div className="card shadow-sm border-0 mb-3">
      <div className="card-body py-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h2 className="h6 mb-0">{t('historiaConsumos.filtersTitle', 'Filtros')}</h2>
          {active && (
            <button
              type="button"
              className="btn btn-link btn-sm p-0"
              onClick={() => onReset?.()}
            >
              {t('historiaConsumos.filtersClear', 'Limpiar filtros')}
            </button>
          )}
        </div>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-6 col-lg-3">
            <label htmlFor="historia-filter-period" className="form-label small mb-1">
              {t('historiaConsumos.filterPeriod', 'Periodo')}
            </label>
            <select
              id="historia-filter-period"
              className="form-select form-select-sm"
              value={value.period}
              onChange={(e) => setField('period', e.target.value)}
            >
              <option value={HISTORIA_PERIOD_ALL}>
                {t('historiaConsumos.filterPeriodAll', 'Todas las fechas')}
              </option>
              <option value={HISTORIA_PERIOD_7}>
                {t('historiaConsumos.filterPeriod7', 'Últimos 7 días')}
              </option>
              <option value={HISTORIA_PERIOD_30}>
                {t('historiaConsumos.filterPeriod30', 'Últimos 30 días')}
              </option>
              <option value={HISTORIA_PERIOD_90}>
                {t('historiaConsumos.filterPeriod90', 'Últimos 90 días')}
              </option>
            </select>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <label htmlFor="historia-filter-tipo" className="form-label small mb-1">
              {t('historiaConsumos.tipo', 'Tipo')}
            </label>
            <select
              id="historia-filter-tipo"
              className="form-select form-select-sm"
              value={value.tipo}
              onChange={(e) => setField('tipo', e.target.value)}
            >
              <option value={HISTORIA_FILTER_ALL}>
                {t('historiaConsumos.filterAll', 'Todos')}
              </option>
              {HISTORIA_TIPO_OPTIONS.map((key) => (
                <option key={key} value={key}>
                  {t(`analysis.types.${key}`, key)}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <label htmlFor="historia-filter-zona" className="form-label small mb-1">
              {t('historiaConsumos.zona', 'Zona')}
            </label>
            <select
              id="historia-filter-zona"
              className="form-select form-select-sm"
              value={value.zona}
              onChange={(e) => setField('zona', e.target.value)}
            >
              <option value={HISTORIA_FILTER_ALL}>
                {t('historiaConsumos.filterAll', 'Todos')}
              </option>
              {HISTORIA_ZONA_OPTIONS.map((key) => (
                <option key={key} value={key}>
                  {t(`analysis.zona.${key}`, key)}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-lg-6">
            <span className="form-label small mb-1 d-block">
              {t('historiaConsumos.nivel', 'Nivel')}
            </span>
            <p className="text-muted small mb-2 mb-md-1">
              {t(
                'historiaConsumos.filterNivelMulti',
                'Hasta 2 niveles; sin marcar = todos.',
              )}
            </p>
            <div
              className="d-flex flex-wrap gap-3"
              role="group"
              aria-label={t('historiaConsumos.nivel', 'Nivel')}
            >
              {HISTORIA_NIVEL_OPTIONS.map((key) => {
                const id = `historia-filter-nivel-${key}`
                const checked = selectedNiveles.includes(key)
                const disabled = !checked && atNivelMax
                return (
                  <div className="form-check form-check-inline mb-0" key={key}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={id}
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggleNivel(key)}
                    />
                    <label className="form-check-label small" htmlFor={id}>
                      {t(`analysis.levels.${key}`, key)}
                    </label>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
