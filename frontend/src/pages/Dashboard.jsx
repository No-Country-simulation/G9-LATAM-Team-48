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
import { DEFAULT_DASHBOARD_FILTERS, filterConsumos, PERIOD_ALL } from '../utils/dashboardChartFilters'
import DashboardChartFilters from '../components/DashboardChartFilters'

function Dashboard() {
  const { t } = useLocale()
  const { setPagina } = useNavigation()
  const [chartFilters, setChartFilters] = useState(DEFAULT_DASHBOARD_FILTERS)
  const { data: consumos, loading, error, refetch } = useFetch(getConsumos)
  const {
    data: analytics,
    loading: loadingAnalytics,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useFetch(getAnalyticsOverview)

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
  const chartsReady = !loadingAnalytics && !analyticsError
  const showChartFilters = (consumos?.length ?? 0) > 1

  useEffect(() => {
    if (!showChartFilters) {
      setChartFilters(DEFAULT_DASHBOARD_FILTERS)
    }
  }, [showChartFilters])

  return (
    <div className="container-fluid px-0 px-sm-2">
      <h1 className="mb-4 fs-3 fs-md-2">{t('dashboard.title')}</h1>

      {loading && <Loader mensaje={t('states.loadingConsumo')} />}

      {!loading && error && <ErrorState mensaje={error} onRetry={refetch} />}

      {!loading && !error && !consumos?.length && (
        <EmptyState
          mensaje={t('states.empty')}
          actionLabel={t('historiaConsumos.goToAnalysis', 'Ir a Análisis IA')}
          onAction={() => setPagina('ia')}
        />
      )}

      {!loading && !error && consumos?.length > 0 && (
        <>
          {showChartFilters && (
            <DashboardChartFilters filters={chartFilters} onChange={setChartFilters} />
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
              consumos={consumos}
              analytics={analytics}
              chartBadgeVariant={chartBadgeVariant}
              chartFilters={chartFilters}
            />
          ) : (
            <ChartSectionFallback />
          )}

          <DashboardMisAnalisisSection />

          <Recomendaciones />
        </>
      )}
    </div>
  )
}

export default Dashboard
