import { useState } from 'react'
import { analizarConsumo } from '../services/analisisService'
import ErrorState from '../components/ErrorState'

const initialState = {
  consumo: '',
  personas: '',
  equipos: '',
}

function AnalisisIA() {
  const [datos, setDatos] = useState(initialState)
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function cambiarCampo(e) {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    })
  }

  async function analizar() {
    setError(null)
    setResultado(null)
    setLoading(true)

    try {
      const respuesta = await analizarConsumo({
        consumo: Number(datos.consumo),
        personas: Number(datos.personas),
        equipos: Number(datos.equipos),
      })

      setResultado(respuesta)
    } catch (err) {
      setError(err?.message || 'No se pudo completar el análisis.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid px-0 px-sm-2">
      <h1 className="fs-3 fs-md-2">Análisis Inteligente IA</h1>

      <p className="text-muted">Evaluación del consumo energético</p>

      <div className="card shadow p-3 p-md-4">
        <div className="mb-3">
          <label className="form-label">Consumo mensual (kWh)</label>
          <input
            className="form-control"
            name="consumo"
            value={datos.consumo}
            onChange={cambiarCampo}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cantidad de personas</label>
          <input
            className="form-control"
            name="personas"
            value={datos.personas}
            onChange={cambiarCampo}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cantidad de equipos</label>
          <input
            className="form-control"
            name="equipos"
            value={datos.equipos}
            onChange={cambiarCampo}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={analizar}
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              Analizando...
            </>
          ) : (
            'Analizar consumo'
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4">
          <ErrorState mensaje={error} onRetry={analizar} />
        </div>
      )}

      {resultado && (
        <div className="card shadow mt-4 p-3 p-md-4">
          <h3>Resultado IA</h3>

          <h4>
            Nivel: <span className="text-primary">{resultado.nivel}</span>
          </h4>

          <h4>
            Ahorro estimado:{' '}
            <span className="text-success">{resultado.ahorro}%</span>
          </h4>

          <hr />

          <h5>Recomendaciones</h5>

          <ul className="mb-0">
            {resultado.recomendaciones.map((r, index) => (
              <li key={index}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AnalisisIA
