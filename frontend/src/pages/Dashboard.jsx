import CardConsumo from '../components/CardConsumo'
import GraficoConsumo from '../components/GraficoConsumo'
import Recomendaciones from '../components/Recomendaciones'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { useFetch } from '../hooks/useFetch'
import { getConsumos, calcularResumen } from '../services/consumoService'

function Dashboard() {
  const { data: consumos, loading, error, refetch } = useFetch(getConsumos)

  const resumen = calcularResumen(consumos || [])

  return (
    <div className="container-fluid px-0 px-sm-2">
      <h1 className="mb-1 fs-3 fs-md-2">EnergyAI Dashboard</h1>
      <h6 className="text-muted mb-4">Hackathon ONE G9 - TEAM 48</h6>

      {loading && <Loader mensaje="Cargando datos de consumo..." />}

      {!loading && error && <ErrorState mensaje={error} onRetry={refetch} />}

      {!loading && !error && !consumos?.length && <EmptyState />}

      {!loading && !error && consumos?.length > 0 && (
        <>
          <div className="row mt-2">
            <CardConsumo
              titulo="Consumo último mes"
              valor={`${resumen.ultimo.consumo} kWh`}
            />
            <CardConsumo
              titulo="Costo último mes"
              valor={`$${resumen.ultimo.costo}`}
            />
            <CardConsumo
              titulo="Promedio mensual"
              valor={`${resumen.promedio} kWh`}
            />
          </div>

          <GraficoConsumo consumos={consumos} />

          <Recomendaciones />
        </>
      )}
    </div>
  )
}

export default Dashboard
