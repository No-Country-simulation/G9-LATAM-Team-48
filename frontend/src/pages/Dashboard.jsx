import { useEffect, useMemo, useState } from 'react'
import CardConsumo from '../components/CardConsumo'
import ChartSectionFallback from '../components/ChartSectionFallback'
import DashboardChartsSection from '../components/DashboardChartsSection'
import DashboardMisAnalisisSection from '../components/DashboardMisAnalisisSection'
import ResumenFacil from '../components/ResumenFacil'
import Recomendaciones from '../components/Recomendaciones'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { useFetch } from '../hooks/useFetch'
import { getConsumos, calcularResumenPeriodo } from '../services/consumoService'
import { getAnalyticsOverview } from '../services/analyticsService'
import { useLocale } from '../context/LocaleContext'
import { useNavigation } from '../context/NavigationContext'
import { resolveChartBadgeVariant } from '../utils/chartDataSource'
import { DEFAULT_DASHBOARD_FILTERS, filterConsumos, PERIOD_ALL, TIPO_INMUEBLE_ALL } from '../utils/dashboardChartFilters'
import DashboardChartFilters from '../components/DashboardChartFilters'

function Dashboard() {
  const { t } = useLocale()
  const { setPagina } = useNavigation()
  const [chartFilters, setChartFilters] = useState(DEFAULT_DASHBOARD_FILTERS)
  const tipoFetchKey =
    chartFilters.tipoInmueble && chartFilters.tipoInmueble !== TIPO_INMUEBLE_ALL
      ? chartFilters.tipoInmueble
      : null
  const fetchConsumoOpts = useMemo(
    () => (tipoFetchKey ? { tipoInmueble: tipoFetchKey } : {}),
    [tipoFetchKey],
  )
  const { data: consumos, loading, error, refetch } = useFetch(
    () => getConsumos(fetchConsumoOpts),
    [tipoFetchKey],
  )
  const {
    data: analytics,
    loading: loadingAnalytics,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useFetch(() => getAnalyticsOverview(fetchConsumoOpts), [tipoFetchKey])

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
        ? t('dashboard.kpiTotalUsage', 'Total consumo (periodo)')
        : t('dashboard.kpiTotalUsageYear', 'Total consumo (año)'),
      valor: `${resumen.total} kWh`,
    },
    {
      titulo: periodFiltered
        ? t('dashboard.kpiTotalCost', 'Total costo (periodo)')
        : t('dashboard.kpiTotalCostYear', 'Total costo (año)'),
      valor: `$${resumen.totalCosto}`,
    },
    {
      titulo: periodFiltered
        ? t('dashboard.kpiAvgUsage', 'Promedio mensual (periodo)')
        : t('dashboard.monthlyAverage', 'Promedio mensual'),
      valor: `${resumen.promedio} kWh`,
    },
  ]
  const kpiHint =
    resumen.mesesEnPeriodo > 0
      ? (periodFiltered
          ? t(
              'dashboard.kpiFilteredHint',
              'KPIs calculados con los mismos meses que los gráficos ({count} meses).',
            )
          : t(
              'dashboard.kpiAllMonthsHint',
              'Suma de los {count} meses del benchmark (promedio del dataset por mes calendario; no es tu factura de un solo mes).',
            )
        ).replace('{count}', String(resumen.mesesEnPeriodo))
      : null
  const chartBadgeVariant = resolveChartBadgeVariant(analytics, consumos)
  const fromDataset = chartBadgeVariant === 'dataset'
  const chartsReady = Boolean(analytics) && !analyticsError
  const showChartFilters = (consumos?.length ?? 0) >= 1
  const initialLoad = loading && !consumos?.length
  const refreshingCharts = loading || loadingAnalytics
  const chartsLoading = loadingAnalytics && !analytics
  const tipoFiltered =
    chartFilters.tipoInmueble && chartFilters.tipoInmueble !== TIPO_INMUEBLE_ALL

  useEffect(() => {
    if (!showChartFilters) {
      setChartFilters(DEFAULT_DASHBOARD_FILTERS)
    }
  }, [showChartFilters])

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
          {showChartFilters && (
            <DashboardChartFilters filters={chartFilters} onChange={setChartFilters} />
          )}

          {refreshingCharts && (
            <p className="text-muted small mt-2 mb-0" role="status" aria-live="polite">
              {t('chart.filters.updating', 'Actualizando gráficos…')}
            </p>
          )}

          <div className={`row ${showChartFilters ? 'mt-3' : ''}`}>
            {kpiCards.map((card) => (
              <CardConsumo key={card.titulo} titulo={card.titulo} valor={card.valor} />
            ))}
          </div>
          {kpiHint && (
            <p className="text-muted small mt-2 mb-0" role="note">
              {kpiHint}
            </p>
          )}
          {tipoFiltered && (
            <p className="text-muted small mt-1 mb-0" role="note">
              {t('chart.filters.tipoActiveHint', 'Gráficos y KPIs filtrados por: {tipo}').replace(
                '{tipo}',
                t(`analysis.types.${chartFilters.tipoInmueble}`, chartFilters.tipoInmueble),
              )}
            </p>
          )}

          <div
            className="alert alert-secondary border-0 py-2 small mt-3 mb-0"
            role="note"
          >
            {t(
              fromDataset ? 'dashboard.datasetSampleHint' : 'dashboard.demoSampleHint',
              fromDataset
                ? 'Promedios agregados del dataset del año anterior. No son tus análisis personales.'
                : 'Datos de ejemplo para la demo. No provienen de tus análisis reales.',
            )}
          </div>

          {analyticsError && (
            <div className="alert alert-warning border-0 py-2 small mt-2 mb-0" role="alert">
              {t('states.error')}
              <button
                type="button"
                className="btn btn-link btn-sm p-0 ms-2 align-baseline"
                onClick={refetchAnalytics}
              >
                {t('states.retry')}
              </button>
            </div>
          )}

          <ResumenFacil analytics={analytics} chartBadgeVariant={chartBadgeVariant} />

          {chartsReady ? (
            <DashboardChartsSection
              key={`${chartFilters.period}-${chartFilters.metric}-${chartFilters.tipoInmueble}`}
              consumos={consumos}
              analytics={analytics}
              chartBadgeVariant={chartBadgeVariant}
              chartFilters={chartFilters}
            />
          ) : (
            chartsLoading && <ChartSectionFallback />
          )}

          <DashboardMisAnalisisSection />

          <Recomendaciones />
        </>
      )}
    </div>
  )
}

export default Dashboard
