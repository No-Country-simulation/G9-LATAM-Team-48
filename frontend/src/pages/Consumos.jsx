import CardConsumo from '../components/CardConsumo'
import GraficoConsumo from '../components/GraficoConsumo'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { useFetch } from '../hooks/useFetch'
import { getConsumos, calcularResumen } from '../services/consumoService'
import { getAnalyticsOverview } from '../services/analyticsService'
import { useLocale } from '../context/LocaleContext'
import { useDashboardFilters } from '../context/DashboardFiltersContext'
import { resolveChartBadgeVariant } from '../utils/chartDataSource'
import { formatMonthLabel } from '../utils/monthLabels'
import {
  tiposInmuebleFetchKey,
} from '../utils/dashboardChartFilters'
import { useMemo } from 'react'

function Consumos() {
  const { t, locale } = useLocale()
  const { chartFilters } = useDashboardFilters()
  const tipoFetchKey = tiposInmuebleFetchKey(chartFilters)
  const fetchOpts = useMemo(
    () => (tipoFetchKey ? { tiposInmueble: chartFilters.tiposInmueble } : {}),
    [tipoFetchKey, chartFilters.tiposInmueble],
  )

  const { data: consumoBundle, loading, error, refetch } = useFetch(
    () => getConsumos(fetchOpts),
    [tipoFetchKey],
  )
  const { data: analytics } = useFetch(
    () => getAnalyticsOverview(fetchOpts),
    [tipoFetchKey],
  )

  const consumos = consumoBundle?.consumos
  const resumen = calcularResumen(consumos || [])
  const chartBadgeVariant = resolveChartBadgeVariant(analytics, consumos, {
    consumosFromDataset: consumoBundle?.fromDataset,
  })
  const fromDataset = chartBadgeVariant === 'dataset'

  return (
    <div className="container-fluid px-0 px-sm-2">
      <h1 className="mb-2 fs-3 fs-md-2">{t('consumos.title')}</h1>
      <p className="text-muted mb-4">{t('consumos.subtitle')}</p>

      {loading && <Loader mensaje={t('states.loadingHistorial')} />}

      {!loading && error && <ErrorState mensaje={error} onRetry={refetch} />}

      {!loading && !error && !consumos?.length && <EmptyState />}

      {!loading && !error && consumos?.length > 0 && (
        <>
          <div className="row mt-2">
            <CardConsumo
              titulo={t('consumos.totalUsage')}
              valor={`${resumen.total} kWh`}
            />
            <CardConsumo
              titulo={t('consumos.totalCost')}
              valor={`$${resumen.costo}`}
            />
            <CardConsumo
              titulo={t('consumos.monthlyAverage')}
              valor={`${resumen.promedio} kWh`}
            />
          </div>

          <div
            className="alert alert-secondary border-0 py-2 small mb-0"
            role="note"
          >
            {t(
              fromDataset ? 'dashboard.datasetSampleHint' : 'dashboard.demoSampleHint',
            )}
          </div>

          <div className="card shadow mb-4 mt-4">
            <div className="card-body">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
                <h4 className="mb-0">{t('consumos.history')}</h4>
                <span className="badge text-bg-warning text-wrap">
                  {t('consumos.peak')}: {formatMonthLabel(t, resumen.mesMayor.mes, 'full', locale)} (
                  {resumen.mesMayor.consumo} kWh)
                </span>
              </div>

              <div className="table-responsive">
                <table className="table table-striped align-middle mb-0">
                  <thead>
                    <tr>
                      <th>{t('consumos.month')}</th>
                      <th>{t('consumos.usageKwh')}</th>
                      <th>{t('consumos.estimatedCost')}</th>
                      <th>{t('consumos.status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consumos.map((item) => {
                      const above = item.consumo > resumen.promedio

                      return (
                        <tr key={item.mes}>
                          <td>{formatMonthLabel(t, item.mes, 'full', locale)}</td>
                          <td>{item.consumo}</td>
                          <td>${item.costo}</td>
                          <td>
                            <span
                              className={`badge ${
                                above ? 'text-bg-danger' : 'text-bg-success'
                              }`}
                            >
                              {above
                                ? t('consumos.aboveAverage')
                                : t('consumos.normal')}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <GraficoConsumo consumos={consumos} chartBadgeVariant={chartBadgeVariant} />
        </>
      )}
    </div>
  )
}

export default Consumos
