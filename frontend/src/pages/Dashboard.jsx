import CardConsumo from '../components/CardConsumo'
import ChartSectionFallback from '../components/ChartSectionFallback'
import ResumenFacil from '../components/ResumenFacil'
import Recomendaciones from '../components/Recomendaciones'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { lazy, Suspense } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getConsumos, calcularResumen } from '../services/consumoService'
import { getAnalyticsOverview } from '../services/analyticsService'
import { useLocale } from '../context/LocaleContext'
import { useNavigation } from '../context/NavigationContext'

const DashboardChartsSection = lazy(
  () => import('../components/DashboardChartsSection'),
)

function Dashboard() {
  const { t } = useLocale()
  const { setPagina } = useNavigation()
  const { data: consumos, loading, error, refetch } = useFetch(getConsumos)
  const {
    data: analytics,
    loading: loadingAnalytics,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useFetch(getAnalyticsOverview)

  const resumen = calcularResumen(consumos || [])
  const fromDataset = Boolean(analytics?.fromDataset)
  const chartBadgeVariant = fromDataset ? 'dataset' : 'demo'
  const chartsReady = !loadingAnalytics && !analyticsError

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
          <div className="row mt-2">
            <CardConsumo
              titulo={t('dashboard.lastMonthUsage')}
              valor={`${resumen.ultimo.consumo} kWh`}
            />
            <CardConsumo
              titulo={t('dashboard.lastMonthCost')}
              valor={`$${resumen.ultimo.costo}`}
            />
            <CardConsumo
              titulo={t('dashboard.monthlyAverage')}
              valor={`${resumen.promedio} kWh`}
            />
          </div>

          <div
            className="alert alert-secondary border-0 py-2 small mt-3 mb-0"
            role="note"
          >
            {t(
              fromDataset ? 'dashboard.datasetSampleHint' : 'dashboard.demoSampleHint',
              fromDataset
                ? 'Promedios agregados del dataset de feature engineering (Data Science).'
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

          <ResumenFacil />

          <Suspense fallback={<ChartSectionFallback />}>
            {chartsReady ? (
              <DashboardChartsSection
                consumos={consumos}
                analytics={analytics}
                chartBadgeVariant={chartBadgeVariant}
              />
            ) : (
              <ChartSectionFallback />
            )}
          </Suspense>

          <Recomendaciones />
        </>
      )}
    </div>
  )
}

export default Dashboard
