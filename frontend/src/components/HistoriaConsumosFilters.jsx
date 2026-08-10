import { useLocale } from '../context/LocaleContext'
import {
  DASHBOARD_TIPO_OPTIONS,
  tiposInmuebleUiSelection,
  toggleTiposInmuebleSelection,
} from '../utils/dashboardChartFilters'
import {
  DEFAULT_HISTORIA_FILTERS,
  HISTORIA_NIVEL_OPTIONS,
  HISTORIA_PERIOD_30,
  HISTORIA_PERIOD_7,
  HISTORIA_PERIOD_90,
  HISTORIA_PERIOD_ALL,
  hasActiveHistoriaFilters,
  nivelesUiSelection,
  toggleNivelesSelection,
} from '../utils/historiaConsumoFilters'

export default function HistoriaConsumosFilters({
  filters,
  onChange,
  onReset,
  layout = 'main',
}) {
  const { t } = useLocale()
  const value = filters ?? DEFAULT_HISTORIA_FILTERS
  const selectedTipos = tiposInmuebleUiSelection(value.tiposInmueble)
  const selectedNiveles = nivelesUiSelection(value.niveles)
  const active = hasActiveHistoriaFilters(value)
  const isSidebar = layout === 'sidebar'
  const idPrefix = isSidebar ? 'historia-sidebar' : 'historia-main'

  const setField = (field, next) => {
    onChange?.({ ...value, [field]: next })
  }

  const onTipoToggle = (key) => {
    const next = toggleTiposInmuebleSelection(value.tiposInmueble, key)
    setField('tiposInmueble', next)
  }

  const onNivelToggle = (key) => {
    const next = toggleNivelesSelection(value.niveles, key)
    setField('niveles', next)
  }

  const shellClass = isSidebar
    ? 'dashboard-chart-filters dashboard-chart-filters--sidebar border-top pt-3 mt-2'
    : 'card shadow-sm border-0 dashboard-chart-filters dashboard-chart-filters--main'

  const fields = (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
        <h2 className={`h6 ${isSidebar ? 'mb-0 px-1' : 'mb-0'}`}>
          {t('common.filters', 'Filtros')}
        </h2>
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
      <div className={isSidebar ? 'd-flex flex-column gap-2' : 'row g-3 align-items-stretch'}>
        <div className={isSidebar ? '' : 'col-12 col-lg-5'}>
          <fieldset className="dashboard-filter-group h-100">
            <legend className="dashboard-filter-group__legend">
              {t('chart.filters.tipoInmueble')}
            </legend>
            <div className="dashboard-tipo-checkboxes">
              {DASHBOARD_TIPO_OPTIONS.map((key) => {
                const inputId = `${idPrefix}-filter-tipo-${key}`
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
        <div className={isSidebar ? '' : 'col-12 col-md-6 col-lg-3'}>
          <fieldset className="dashboard-filter-group h-100">
            <legend className="dashboard-filter-group__legend">
              {t('historiaConsumos.filterPeriod', 'Periodo')}
            </legend>
            <select
              id={`${idPrefix}-filter-period`}
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
        <div className={isSidebar ? '' : 'col-12 col-md-6 col-lg-4'}>
          <fieldset className="dashboard-filter-group h-100">
            <legend className="dashboard-filter-group__legend">
              {t('historiaConsumos.nivel', 'Nivel')}
            </legend>
            <div className="dashboard-tipo-checkboxes">
              {HISTORIA_NIVEL_OPTIONS.map((key) => {
                const inputId = `${idPrefix}-filter-nivel-${key}`
                return (
                  <div className="form-check form-check-sm mb-0" key={key}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={inputId}
                      checked={selectedNiveles.includes(key)}
                      onChange={() => onNivelToggle(key)}
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
    </>
  )

  if (isSidebar) {
    return <div className={shellClass}>{fields}</div>
  }

  return (
    <div className={shellClass}>
      <div className="card-body py-3">{fields}</div>
    </div>
  )
}
