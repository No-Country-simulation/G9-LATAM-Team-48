import { useEffect, useMemo } from 'react'
import CardConsumo from '../components/CardConsumo'
import DashboardChartsLazy from '../components/DashboardChartsLazy'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { useFetch } from '../hooks/useFetch'
import { getConsumos, calcularResumenPeriodo } from '../services/consumoService'
import {
  getAnalyticsBreakdown,
  getAnalyticsOverview,
} from '../services/analyticsService'
import { useLocale } from '../context/LocaleContext'
import { useNavigation } from '../context/NavigationContext'
import { resolveChartBadgeVariant } from '../utils/chartDataSource'
import {
  DEFAULT_DASHBOARD_FILTERS,
  filterConsumos,
  monthKeysFromConsumos,
  normalizeTiposInmueble,
  PERIOD_ALL,
  tiposInmuebleFetchKey,
} from '../utils/dashboardChartFilters'
import { useDashboardFilters } from '../context/DashboardFiltersContext'

function Dashboard() {
  const { t } = useLocale()
  const { setPagina } = useNavigation()
  const { chartFilters, setChartFilters, setFiltersVisible } = useDashboardFilters()
  const tipoFetchKey = tiposInmuebleFetchKey(chartFilters)
  const fetchConsumoOpts = useMemo(
    () => (tipoFetchKey ? { tiposInmueble: chartFilters.tiposInmueble } : {}),
    [tipoFetchKey, chartFilters.tiposInmueble],
  )
  const { data: consumoBundle, loading, error, refetch } = useFetch(
    () => getConsumos(fetchConsumoOpts),
    [tipoFetchKey],
  )
  const consumos = consumoBundle?.consumos
  const {
    data: analytics,
    loading: loadingAnalytics,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useFetch(() => getAnalyticsOverview(fetchConsumoOpts), [tipoFetchKey])

  const filteredConsumosForBreakdown = useMemo(
    () => filterConsumos(consumos, chartFilters.period),
    [consumos, chartFilters.period],
  )
  const breakdownMonthKeys = useMemo(
    () => monthKeysFromConsumos(filteredConsumosForBreakdown),
    [filteredConsumosForBreakdown],
  )
  const breakdownMonthKey = breakdownMonthKeys.join(',')

  const {
    data: breakdown,
    loading: loadingBreakdown,
    refetch: refetchBreakdown,
  } = useFetch(
    () =>
      getAnalyticsBreakdown(breakdownMonthKeys, {
        tiposInmueble: normalizeTiposInmueble(chartFilters.tiposInmueble),
      }),
    [tipoFetchKey, breakdownMonthKey],
    { enabled: Boolean(consumos?.length) },
  )

  const filteredConsumos = useMemo(
    () => filterConsumos(consumos, chartFilters.period),
    [consumos, chartFilters.period],
  )
  const resumen = useMemo(() => {
    const rows = filteredConsumos.length > 0 ? filteredConsumos : consumos || []
    return calcularResumenPeriodo(rows)
  }, [filteredConsumos, consumos])

  const periodFiltered = chartFilters.period !== PERIOD_ALL

  const kpiCards = [
    {
      titulo: periodFiltered
        ? t('dashboard.kpiTotalUsage')
        : t('dashboard.kpiTotalUsageYear'),
      valor: `${resumen.total} kWh`,
    },
    {
      titulo: periodFiltered
        ? t('dashboard.kpiTotalCost')
        : t('dashboard.kpiTotalCostYear'),
      valor: `$${resumen.totalCosto}`,
    },
    {
      titulo: periodFiltered
        ? t('dashboard.kpiAvgUsage')
        : t('dashboard.monthlyAverage'),
      valor: `${resumen.promedio} kWh`,
    },
  ]
  const chartBadgeVariant = resolveChartBadgeVariant(analytics, consumos, {
    consumosFromDataset: consumoBundle?.fromDataset,
  })
  const showChartFilters = (consumos?.length ?? 0) >= 1
  const initialLoad = loading && !consumos?.length
  const refreshingCharts = loading || loadingAnalytics || loadingBreakdown

  useEffect(() => {
    setFiltersVisible(showChartFilters)
    if (!showChartFilters) {
      setChartFilters(DEFAULT_DASHBOARD_FILTERS)
    }
  }, [showChartFilters, setChartFilters, setFiltersVisible])

  const retryAnalytics = () => {
    refetchAnalytics()
    refetchBreakdown()
  }

  return (
    <div className="container-fluid px-0 px-sm-2">
      <h1 className="mb-4 fs-3 fs-md-2">{t('dashboard.title')}</h1>

      {initialLoad && <Loader mensaje={t('states.loadingConsumo')} />}

      {!initialLoad && error && <ErrorState mensaje={error} onRetry={refetch} />}

      {!initialLoad && !error && !consumos?.length && (
        <EmptyState
          mensaje={t('states.empty')}
          actionLabel={t('historiaConsumos.goToAnalysis', 'Ir a Análisis IA')}
          onAction={() => setPagina('ia')}
        />
      )}

      {!initialLoad && !error && consumos?.length > 0 && (
        <>
          {refreshingCharts && (
            <p className="text-muted small mt-2 mb-0" role="status" aria-live="polite">
              {t('chart.filters.updating')}
            </p>
          )}

          <div className="row mt-3">
            {kpiCards.map((card) => (
              <CardConsumo key={card.titulo} titulo={card.titulo} valor={card.valor} />
            ))}
          </div>

          {analyticsError && (
            <div className="alert alert-warning border-0 py-2 small mt-2 mb-0" role="alert">
              {t('states.error')}
              <button
                type="button"
                className="btn btn-link btn-sm p-0 ms-2 align-baseline"
                onClick={retryAnalytics}
              >
                {t('states.retry')}
              </button>
            </div>
          )}

          <DashboardChartsLazy
            consumos={consumos}
            analytics={analyticsError ? null : analytics}
            analyticsPending={loadingAnalytics && !analytics}
            breakdown={breakdown}
            breakdownPending={loadingBreakdown && !breakdown}
            chartBadgeVariant={chartBadgeVariant}
            chartFilters={chartFilters}
          />
        </>
      )}
    </div>
  )
}

export default Dashboard
