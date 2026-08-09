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

export default function DashboardChartFilters({ filters, onChange }) {
  const { t } = useLocale()
  const value = filters ?? DEFAULT_DASHBOARD_FILTERS
  const selectedTipos = normalizeTiposInmueble(value.tiposInmueble ?? value.tipoInmueble)

  const setField = (field, next) => {
    onChange?.({ ...value, [field]: next, tipoInmueble: undefined })
  }

  const onTiposChange = (event) => {
    const next = Array.from(event.target.selectedOptions, (option) => option.value)
    setField('tiposInmueble', next)
  }

  return (
    <div className="card shadow-sm mt-2 border-0">
      <div className="card-body py-3">
        <h2 className="h6 mb-3">{t('chart.filters.title', 'Filtros del dashboard')}</h2>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-6 col-lg-4">
            <label htmlFor="dashboard-filter-tipo" className="form-label small mb-1">
              {t('chart.filters.tipoInmueble', 'Tipo de inmueble')}
            </label>
            <select
              id="dashboard-filter-tipo"
              multiple
              size={DASHBOARD_TIPO_OPTIONS.length}
              className="form-select form-select-sm"
              value={selectedTipos}
              onChange={onTiposChange}
              aria-describedby="dashboard-filter-tipo-hint"
            >
              {DASHBOARD_TIPO_OPTIONS.map((key) => (
                <option key={key} value={key}>
                  {t(`analysis.types.${key}`, key)}
                </option>
              ))}
            </select>
            <p id="dashboard-filter-tipo-hint" className="text-muted small mb-0 mt-1">
              {t(
                'chart.filters.tiposListHint',
                'Ctrl+clic (Mac: ⌘) para elegir varios en la lista. Sin selección = todos.',
              )}
            </p>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label htmlFor="dashboard-filter-period" className="form-label small mb-1">
              {t('chart.filters.period', 'Periodo')}
            </label>
            <select
              id="dashboard-filter-period"
              className="form-select form-select-sm"
              value={value.period}
              onChange={(e) => setField('period', e.target.value)}
            >
              <option value={PERIOD_ALL}>{t('chart.filters.periodAll', 'Todos los meses')}</option>
              <option value={PERIOD_LAST_6}>{t('chart.filters.periodLast6', 'Últimos 6 meses')}</option>
              <option value={PERIOD_LAST_3}>{t('chart.filters.periodLast3', 'Últimos 3 meses')}</option>
            </select>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label htmlFor="dashboard-filter-metric" className="form-label small mb-1">
              {t('chart.filters.metric', 'Métrica')}
            </label>
            <select
              id="dashboard-filter-metric"
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
      </div>
    </div>
  )
}
