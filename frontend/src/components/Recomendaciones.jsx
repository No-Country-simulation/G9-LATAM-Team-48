import Loader from './Loader'
import ErrorState from './ErrorState'
import { useFetch } from '../hooks/useFetch'
import { getRecomendaciones } from '../services/recomendacionesService'

function Recomendaciones() {
  const { data, loading, error, refetch } = useFetch(getRecomendaciones)

  const destacadas = (data || []).slice(0, 4)

  return (
    <div className="card shadow mt-4">
      <div className="card-body">
        <h4>Recomendaciones IA</h4>

        {loading && <Loader mensaje="Cargando recomendaciones..." />}

        {!loading && error && <ErrorState mensaje={error} onRetry={refetch} />}

        {!loading && !error && (
          <ul className="mb-0">
            {destacadas.map((item) => (
              <li key={item.id}>{item.titulo}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Recomendaciones
