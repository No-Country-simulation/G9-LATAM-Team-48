import { lazy, Suspense } from 'react'
import CardConsumo from '../components/CardConsumo'
import ChartSectionFallback from '../components/ChartSectionFallback'
import ResumenFacil from '../components/ResumenFacil'

const GraficoConsumo = lazy(() => import('../components/GraficoConsumo'))
const GraficoRealVsPrediccion = lazy(() => import('../components/GraficoRealVsPrediccion'))
const GraficoPicoValle = lazy(() => import('../components/GraficoPicoValle'))
import Recomendaciones from '../components/Recomendaciones'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { useFetch } from '../hooks/useFetch'
import { getConsumos, calcularResumen } from '../services/consumoService'
import { useLocale } from '../context/LocaleContext'
import { useNavigation } from '../context/NavigationContext'

function Dashboard() {
  const { t } = useLocale()
  const { setPagina } = useNavigation()
  const { data: consumos, loading, error, refetch } = useFetch(getConsumos)

  const resumen = calcularResumen(consumos || [])

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
              'dashboard.demoSampleHint',
              'Datos de ejemplo para la demo. No provienen de tus análisis reales.',
            )}
          </div>

          <ResumenFacil />

          <Suspense fallback={<ChartSectionFallback />}>
            <GraficoConsumo consumos={consumos} />
          </Suspense>

          <div className="row g-3 mt-1 align-items-stretch">
            <div className="col-12 col-xl-6 d-flex">
              <Suspense fallback={<ChartSectionFallback />}>
                <GraficoRealVsPrediccion />
              </Suspense>
            </div>
            <div className="col-12 col-xl-6 d-flex">
              <Suspense fallback={<ChartSectionFallback />}>
                <GraficoPicoValle />
              </Suspense>
            </div>
          </div>

          <Recomendaciones />
        </>
      )}
    </div>
  )
}

export default Dashboard
