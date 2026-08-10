import { useLocale } from '../context/LocaleContext'
import {
  DASHBOARD_TIPO_OPTIONS,
  DEFAULT_DASHBOARD_FILTERS,
  METRIC_BOTH,
  METRIC_COST,
  METRIC_KWH,
  PERIOD_ALL,
  PERIOD_LAST_3,
  PERIOD_LAST_6,
  tiposInmuebleUiSelection,
  toggleTiposInmuebleSelection,
} from '../utils/dashboardChartFilters'

export default function DashboardChartFilters({ filters, onChange, layout = 'main' }) {
  const { t } = useLocale()
  const value = filters ?? DEFAULT_DASHBOARD_FILTERS
  const selectedTipos = tiposInmuebleUiSelection(value.tiposInmueble ?? value.tipoInmueble)
  const isSidebar = layout === 'sidebar'
  const idPrefix = isSidebar ? 'sidebar' : 'dashboard'

  const setField = (field, next) => {
    onChange?.({ ...value, [field]: next, tipoInmueble: undefined })
  }

  const onTipoToggle = (key) => {
    const next = toggleTiposInmuebleSelection(value.tiposInmueble, key)
    setField('tiposInmueble', next)
  }

  const shellClass = isSidebar
    ? 'dashboard-chart-filters dashboard-chart-filters--sidebar border-top pt-3 mt-2'
    : 'card shadow-sm border-0 dashboard-chart-filters dashboard-chart-filters--main'

  const inner = (
    <>
      <h2 className={`h6 ${isSidebar ? 'mb-2 px-1' : 'mb-3'}`}>
        {t('chart.filters.title')}
      </h2>
      <div className={isSidebar ? 'd-flex flex-column gap-2' : 'row g-3 align-items-end'}>
        <div className={isSidebar ? '' : 'col-12 col-md-6 col-lg-4'}>
          <span className="form-label small mb-1 d-block" id={`${idPrefix}-filter-tipo-label`}>
            {t('chart.filters.tipoInmueble')}
          </span>
          <div
            className="dashboard-tipo-checkboxes"
            role="group"
            aria-labelledby={`${idPrefix}-filter-tipo-label`}
          >
            {DASHBOARD_TIPO_OPTIONS.map((key) => {
              const inputId = `${idPrefix}-filter-tipo-${key}`
              return (
                <div className="form-check form-check-sm" key={key}>
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
        </div>
        <div className={isSidebar ? '' : 'col-12 col-md-6 col-lg-4'}>
          <label htmlFor={`${idPrefix}-filter-period`} className="form-label small mb-1">
            {t('chart.filters.period')}
          </label>
          <select
            id={`${idPrefix}-filter-period`}
            className="form-select form-select-sm"
            value={value.period}
            onChange={(e) => setField('period', e.target.value)}
          >
            <option value={PERIOD_ALL}>{t('chart.filters.periodAll')}</option>
            <option value={PERIOD_LAST_6}>{t('chart.filters.periodLast6')}</option>
            <option value={PERIOD_LAST_3}>{t('chart.filters.periodLast3')}</option>
          </select>
        </div>
        <div className={isSidebar ? '' : 'col-12 col-md-6 col-lg-4'}>
          <label htmlFor={`${idPrefix}-filter-metric`} className="form-label small mb-1">
            {t('chart.filters.metric')}
          </label>
          <select
            id={`${idPrefix}-filter-metric`}
            className="form-select form-select-sm"
            value={value.metric}
            onChange={(e) => setField('metric', e.target.value)}
          >
            <option value={METRIC_BOTH}>{t('chart.filters.metricBoth')}</option>
            <option value={METRIC_KWH}>{t('chart.filters.metricKwh')}</option>
            <option value={METRIC_COST}>{t('chart.filters.metricCost')}</option>
          </select>
        </div>
      </div>
    </>
  )

  if (isSidebar) {
    return <div className={shellClass}>{inner}</div>
  }

  return (
    <div className={shellClass}>
      <div className="card-body py-3">{inner}</div>
    </div>
  )
}
