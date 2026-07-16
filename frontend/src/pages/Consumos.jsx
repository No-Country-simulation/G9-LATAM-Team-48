import CardConsumo from '../components/CardConsumo'
import GraficoConsumo from '../components/GraficoConsumo'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { useFetch } from '../hooks/useFetch'
import { getConsumos, calcularResumen } from '../services/consumoService'

function Consumos() {
  const { data: consumos, loading, error, refetch } = useFetch(getConsumos)

  const resumen = calcularResumen(consumos || [])

  return (
    <div className="container-fluid px-0 px-sm-2">
      <h1 className="mb-2 fs-3 fs-md-2">Consumos energéticos</h1>
      <p className="text-muted mb-4">
        Detalle mensual del consumo en kWh y costo estimado.
      </p>

      {loading && <Loader mensaje="Cargando historial de consumo..." />}

      {!loading && error && <ErrorState mensaje={error} onRetry={refetch} />}

      {!loading && !error && !consumos?.length && <EmptyState />}

      {!loading && !error && consumos?.length > 0 && (
        <>
          <div className="row">
            <CardConsumo titulo="Consumo total" valor={`${resumen.total} kWh`} />
            <CardConsumo titulo="Costo total" valor={`$${resumen.costo}`} />
            <CardConsumo
              titulo="Promedio mensual"
              valor={`${resumen.promedio} kWh`}
            />
          </div>

          <div className="card shadow mb-4">
            <div className="card-body">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
                <h4 className="mb-0">Historial mensual</h4>
                <span className="badge text-bg-warning text-wrap">
                  Mayor consumo: {resumen.mesMayor.mes} ({resumen.mesMayor.consumo}{' '}
                  kWh)
                </span>
              </div>

              <div className="table-responsive">
                <table className="table table-striped align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th>Consumo (kWh)</th>
                      <th>Costo estimado</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consumos.map((item) => {
                      const estado =
                        item.consumo > resumen.promedio
                          ? 'Sobre promedio'
                          : 'Normal'

                      return (
                        <tr key={item.mes}>
                          <td>{item.mes}</td>
                          <td>{item.consumo}</td>
                          <td>${item.costo}</td>
                          <td>
                            <span
                              className={`badge ${
                                estado === 'Normal'
                                  ? 'text-bg-success'
                                  : 'text-bg-danger'
                              }`}
                            >
                              {estado}
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

          <GraficoConsumo consumos={consumos} />
        </>
      )}
    </div>
  )
}

export default Consumos
