import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { useFetch } from '../hooks/useFetch'
import { getRecomendaciones } from '../services/recomendacionesService'

const prioridadClass = {
  Alta: 'text-bg-danger',
  Media: 'text-bg-warning',
  Baja: 'text-bg-secondary',
}

function RecomendacionesPage() {
  const { data, loading, error, refetch } = useFetch(getRecomendaciones)

  const recomendaciones = data || []

  const ahorroTotal = recomendaciones.reduce((sum, item) => {
    return sum + Number(item.ahorro.replace('%', ''))
  }, 0)

  const prioridadAlta = recomendaciones.filter(
    (item) => item.prioridad === 'Alta'
  ).length

  return (
    <div className="container-fluid px-0 px-sm-2 page-content">
      <h1 className="mb-2 fs-3 fs-md-2">Recomendaciones IA</h1>
      <p className="text-muted mb-4">
        Sugerencias personalizadas para optimizar el consumo energético.
      </p>

      {loading && <Loader mensaje="Cargando recomendaciones..." />}

      {!loading && error && <ErrorState mensaje={error} onRetry={refetch} />}

      {!loading && !error && !recomendaciones.length && <EmptyState />}

      {!loading && !error && recomendaciones.length > 0 && (
        <>
          <div className="row mb-4 g-3">
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h6 className="text-muted">Total de recomendaciones</h6>
                  <h2>{recomendaciones.length}</h2>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h6 className="text-muted">Prioridad alta</h6>
                  <h2>{prioridadAlta}</h2>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h6 className="text-muted">Ahorro potencial acumulado</h6>
                  <h2>{ahorroTotal}%</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {recomendaciones.map((item) => (
              <div className="col-12 col-lg-6" key={item.id}>
                <div className="card shadow h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge text-bg-primary">
                        {item.categoria}
                      </span>
                      <span className={`badge ${prioridadClass[item.prioridad]}`}>
                        {item.prioridad}
                      </span>
                    </div>

                    <h5>{item.titulo}</h5>
                    <p className="text-muted mb-3">{item.descripcion}</p>

                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">Ahorro estimado</small>
                      <strong className="text-success">{item.ahorro}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default RecomendacionesPage
