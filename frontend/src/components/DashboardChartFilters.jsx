import { useLocale } from '../context/LocaleContext'
import {
  DASHBOARD_TIPO_OPTIONS,
  DEFAULT_DASHBOARD_FILTERS,
  METRIC_BOTH,
  METRIC_COST,
  METRIC_KWH,
  normalizeTiposInmueble,
  PERIOD_ALL,
  PERIOD_LAST_3,
  PERIOD_LAST_6,
} from '../utils/dashboardChartFilters'

export default function DashboardChartFilters({ filters, onChange, layout = 'main' }) {
  const { t } = useLocale()
  const value = filters ?? DEFAULT_DASHBOARD_FILTERS
  const selectedTipos = normalizeTiposInmueble(value.tiposInmueble ?? value.tipoInmueble)
  const isSidebar = layout === 'sidebar'
  const idPrefix = isSidebar ? 'sidebar' : 'dashboard'

  const setField = (field, next) => {
    onChange?.({ ...value, [field]: next, tipoInmueble: undefined })
  }

  const onTiposChange = (event) => {
    const next = Array.from(event.target.selectedOptions, (option) => option.value)
    setField('tiposInmueble', next)
  }

  const shellClass = isSidebar
    ? 'dashboard-chart-filters dashboard-chart-filters--sidebar border-top pt-3 mt-2'
    : 'card shadow-sm border-0 dashboard-chart-filters dashboard-chart-filters--main'

  const inner = (
    <>
      <h2 className={`h6 ${isSidebar ? 'mb-2 px-1' : 'mb-3'}`}>
        {t('chart.filters.title', 'Filtros del dashboard')}
      </h2>
      <div className={isSidebar ? 'd-flex flex-column gap-2' : 'row g-3 align-items-end'}>
        <div className={isSidebar ? '' : 'col-12 col-md-6 col-lg-4'}>
          <label htmlFor={`${idPrefix}-filter-tipo`} className="form-label small mb-1">
            {t('chart.filters.tipoInmueble', 'Tipo de inmueble')}
          </label>
          <select
            id={`${idPrefix}-filter-tipo`}
            multiple
            size={DASHBOARD_TIPO_OPTIONS.length}
            className="form-select form-select-sm"
            value={selectedTipos}
            onChange={onTiposChange}
            aria-describedby={`${idPrefix}-filter-tipo-hint`}
          >
            {DASHBOARD_TIPO_OPTIONS.map((key) => (
              <option key={key} value={key}>
                {t(`analysis.types.${key}`, key)}
              </option>
            ))}
          </select>
          <p id={`${idPrefix}-filter-tipo-hint`} className="text-muted small mb-0 mt-1">
            {t(
              'chart.filters.tiposListHint',
              'Ctrl+clic (Mac: ⌘) para elegir varios en la lista. Sin selección = todos.',
            )}
          </p>
        </div>
        <div className={isSidebar ? '' : 'col-12 col-md-6 col-lg-4'}>
          <label htmlFor={`${idPrefix}-filter-period`} className="form-label small mb-1">
            {t('chart.filters.period', 'Periodo')}
          </label>
          <select
            id={`${idPrefix}-filter-period`}
            className="form-select form-select-sm"
            value={value.period}
            onChange={(e) => setField('period', e.target.value)}
          >
            <option value={PERIOD_ALL}>{t('chart.filters.periodAll', 'Todos los meses')}</option>
            <option value={PERIOD_LAST_6}>{t('chart.filters.periodLast6', 'Últimos 6 meses')}</option>
            <option value={PERIOD_LAST_3}>{t('chart.filters.periodLast3', 'Últimos 3 meses')}</option>
          </select>
        </div>
        <div className={isSidebar ? '' : 'col-12 col-md-6 col-lg-4'}>
          <label htmlFor={`${idPrefix}-filter-metric`} className="form-label small mb-1">
            {t('chart.filters.metric', 'Métrica')}
          </label>
          <select
            id={`${idPrefix}-filter-metric`}
            className="form-select form-select-sm"
            value={value.metric}
            onChange={(e) => setField('metric', e.target.value)}
          >
            <option value={METRIC_BOTH}>{t('chart.filters.metricBoth', 'kWh y costo')}</option>
            <option value={METRIC_KWH}>{t('chart.filters.metricKwh', 'Solo kWh')}</option>
            <option value={METRIC_COST}>{t('chart.filters.metricCost', 'Solo costo')}</option>
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
