import CardConsumo from '../components/CardConsumo'
import GraficoConsumo from '../components/GraficoConsumo'
import GraficoRealVsPrediccion from '../components/GraficoRealVsPrediccion'
import GraficoPicoValle from '../components/GraficoPicoValle'
import ResumenFacil from '../components/ResumenFacil'
import Recomendaciones from '../components/Recomendaciones'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { useFetch } from '../hooks/useFetch'
import { getConsumos, calcularResumen } from '../services/consumoService'
import { useLocale } from '../context/LocaleContext'

function Dashboard() {
  const { t } = useLocale()
  const { data: consumos, loading, error, refetch } = useFetch(getConsumos)

  const resumen = calcularResumen(consumos || [])

  return (
    <div className="container-fluid px-0 px-sm-2">
      <h1 className="mb-1 fs-3 fs-md-2">{t('dashboard.title')}</h1>
      <h6 className="text-muted mb-4">{t('dashboard.subtitle')}</h6>

      {loading && <Loader mensaje={t('states.loadingConsumo')} />}

      {!loading && error && <ErrorState mensaje={error} onRetry={refetch} />}

      {!loading && !error && !consumos?.length && <EmptyState />}

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

          <ResumenFacil />

          <GraficoConsumo consumos={consumos} />

          <div className="row g-3 mt-1 align-items-stretch">
            <div className="col-12 col-xl-6 d-flex">
              <GraficoRealVsPrediccion />
            </div>
            <div className="col-12 col-xl-6 d-flex">
              <GraficoPicoValle />
            </div>
          </div>

          <Recomendaciones />
        </>
      )}
    </div>
  )
}

export default Dashboard
