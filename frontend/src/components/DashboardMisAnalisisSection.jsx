import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { useNavigation } from '../context/NavigationContext'
import { listMisAnalisisChartPoints } from '../services/historiaConsumosService'
import GraficoHistoriaConsumo from './GraficoHistoriaConsumo'
import GraficosHistoriaExtra from './GraficosHistoriaExtra'
import Loader from './Loader'

function mapConsumoPoints(rows) {
  return (rows ?? []).map((row) => ({
    id: row.id,
    createdAt: row.createdAt,
    consumo: row.consumoKwh ?? row.consumo,
  }))
}

function mapExtraPoints(rows) {
  return (rows ?? []).map((row) => ({
    id: row.id,
    createdAt: row.createdAt,
    ahorro: row.ahorro,
    nivelKey: row.nivelKey,
  }))
}

export default function DashboardMisAnalisisSection() {
  const { t } = useLocale()
  const { isAuthenticated, hydrating, openLogin } = useAuth()
  const { setPagina } = useNavigation()
  const [points, setPoints] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (hydrating || !isAuthenticated) {
      setPoints([])
      return undefined
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    listMisAnalisisChartPoints()
      .then((rows) => {
        if (!cancelled) {
          setPoints(Array.isArray(rows) ? rows : [])
        }
      })
      .catch(() => {
        if (!cancelled) setError(t('states.error'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [hydrating, isAuthenticated, t])

  if (hydrating || !isAuthenticated) {
    return null
  }

  return (
    <section className="mt-4" aria-labelledby="dashboard-my-analysis-title">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 id="dashboard-my-analysis-title" className="h5 mb-0">
          {t('dashboard.myAnalysisTitle', 'Mis análisis IA')}
        </h2>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={() => setPagina('historia')}
        >
          {t('dashboard.myAnalysisViewAll', 'Ver historial completo')}
        </button>
      </div>

      {loading && <Loader mensaje={t('states.loading')} />}

      {!loading && error && (
        <div className="alert alert-warning border-0 py-2 small" role="alert">
          {error}
          <button type="button" className="btn btn-link btn-sm p-0 ms-2" onClick={openLogin}>
            {t('auth.login', 'Iniciar sesión')}
          </button>
        </div>
      )}

      {!loading && !error && points.length === 0 && (
        <div className="alert alert-info border-0 py-2 small mb-0" role="status">
          {t(
            'dashboard.myAnalysisEmpty',
            'Aún no tenés consultas guardadas. Hacé un análisis en Análisis IA.',
          )}
          <button
            type="button"
            className="btn btn-link btn-sm p-0 ms-2 align-baseline"
            onClick={() => setPagina('ia')}
          >
            {t('historiaConsumos.goToAnalysis', 'Ir a Análisis IA')}
          </button>
        </div>
      )}

      {!loading && points.length > 0 && (
        <>
          <GraficoHistoriaConsumo points={mapConsumoPoints(points)} />
          <GraficosHistoriaExtra points={mapExtraPoints(points)} />
        </>
      )}
    </section>
  )
}
