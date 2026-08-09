import { useLocale } from '../context/LocaleContext'
import {
  DASHBOARD_TIPO_OPTIONS,
  DEFAULT_DASHBOARD_FILTERS,
  hasActiveTiposInmuebleFilter,
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
  const tiposActive = hasActiveTiposInmuebleFilter(value)

  const setField = (field, next) => {
    onChange?.({ ...value, [field]: next, tipoInmueble: undefined })
  }

  const toggleTipo = (key) => {
    const current = selectedTipos
    if (current.includes(key)) {
      setField(
        'tiposInmueble',
        current.filter((k) => k !== key),
      )
      return
    }
    setField('tiposInmueble', [...current, key])
  }

  const clearTipos = () => setField('tiposInmueble', [])

  return (
    <div className="card shadow-sm mt-2 border-0">
      <div className="card-body py-3">
        <h2 className="h6 mb-3">{t('chart.filters.title', 'Filtros del dashboard')}</h2>
        <div className="row g-3 align-items-end">
          <div className="col-12">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-1">
              <span className="form-label small mb-0">
                {t('chart.filters.tipoInmueble', 'Tipo de inmueble')}
              </span>
              {tiposActive && (
                <button type="button" className="btn btn-link btn-sm p-0" onClick={clearTipos}>
                  {t('chart.filters.tiposClear', 'Quitar selección')}
                </button>
              )}
            </div>
            <p className="text-muted small mb-2">
              {t(
                'chart.filters.tiposMultiHint',
                'Podés marcar uno o más; sin marcar = todos los tipos.',
              )}
            </p>
            <div
              className="d-flex flex-wrap gap-3"
              role="group"
              aria-label={t('chart.filters.tipoInmueble', 'Tipo de inmueble')}
            >
              {DASHBOARD_TIPO_OPTIONS.map((key) => {
                const id = `dashboard-filter-tipo-${key}`
                const checked = selectedTipos.includes(key)
                return (
                  <div className="form-check form-check-inline mb-0" key={key}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={id}
                      checked={checked}
                      onChange={() => toggleTipo(key)}
                    />
                    <label className="form-check-label small" htmlFor={id}>
                      {t(`analysis.types.${key}`, key)}
                    </label>
                  </div>
                )
              })}
            </div>
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
