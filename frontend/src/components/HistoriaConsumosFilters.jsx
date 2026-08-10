import { useLocale } from '../context/LocaleContext'
import {
  DASHBOARD_TIPO_OPTIONS,
  tiposInmuebleUiSelection,
  toggleTiposInmuebleSelection,
} from '../utils/dashboardChartFilters'
import {
  DEFAULT_HISTORIA_FILTERS,
  HISTORIA_NIVEL_MAX_SELECTED,
  HISTORIA_NIVEL_OPTIONS,
  HISTORIA_PERIOD_30,
  HISTORIA_PERIOD_7,
  HISTORIA_PERIOD_90,
  HISTORIA_PERIOD_ALL,
  hasActiveHistoriaFilters,
} from '../utils/historiaConsumoFilters'

export default function HistoriaConsumosFilters({ filters, onChange, onReset }) {
  const { t } = useLocale()
  const value = filters ?? DEFAULT_HISTORIA_FILTERS
  const selectedTipos = tiposInmuebleUiSelection(value.tiposInmueble)
  const selectedNiveles = value.niveles ?? []
  const active = hasActiveHistoriaFilters(value)

  const setField = (field, next) => {
    onChange?.({ ...value, [field]: next })
  }

  const onTipoToggle = (key) => {
    const next = toggleTiposInmuebleSelection(value.tiposInmueble, key)
    setField('tiposInmueble', next)
  }

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
        <div className="row g-3 align-items-stretch">
          <div className="col-12 col-lg-5">
            <fieldset className="dashboard-filter-group h-100">
              <legend className="dashboard-filter-group__legend">
                {t('chart.filters.tipoInmueble')}
              </legend>
              <div className="dashboard-tipo-checkboxes">
                {DASHBOARD_TIPO_OPTIONS.map((key) => {
                  const inputId = `historia-filter-tipo-${key}`
                  return (
                    <div className="form-check form-check-sm mb-0" key={key}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={inputId}
                        checked={selectedTipos.includes(key)}
                        onChange={() => onTipoToggle(key)}
                      />
                      <label className="form-check-label small" htmlFor={inputId}>
                        {t(`analysis.types.${key}`, key)}
                      </label>
                    </div>
                  )
                })}
              </div>
            </fieldset>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <fieldset className="dashboard-filter-group h-100">
              <legend className="dashboard-filter-group__legend">
                {t('historiaConsumos.filterPeriod', 'Periodo')}
              </legend>
              <select
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
            </fieldset>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <fieldset className="dashboard-filter-group h-100">
              <legend className="dashboard-filter-group__legend">
                {t('historiaConsumos.nivel', 'Nivel')}
              </legend>
              <div className="dashboard-tipo-checkboxes">
                {HISTORIA_NIVEL_OPTIONS.map((key) => {
                  const inputId = `historia-filter-nivel-${key}`
                  const checked = selectedNiveles.includes(key)
                  const disabled =
                    !checked && selectedNiveles.length >= HISTORIA_NIVEL_MAX_SELECTED
                  return (
                    <div className="form-check form-check-sm mb-0" key={key}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={inputId}
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleNivel(key)}
                      />
                      <label className="form-check-label small" htmlFor={inputId}>
                        {t(`analysis.levels.${key}`, key)}
                      </label>
                    </div>
                  )
                })}
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  )
}
