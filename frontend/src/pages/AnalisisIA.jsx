import { useState } from 'react'
import { analizarConsumo } from '../services/analisisService'
import ErrorState from '../components/ErrorState'
import { useLocale } from '../context/LocaleContext'

const initialState = {
  consumo: '',
  personas: '',
  equipos: '',
}

function AnalisisIA() {
  const { t } = useLocale()
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
      setError(err?.message || t('analysis.failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid px-0 px-sm-2">
      <h1 className="fs-3 fs-md-2">{t('analysis.title')}</h1>

      <p className="text-muted">{t('analysis.subtitle')}</p>

      <div className="card shadow p-3 p-md-4">
        <div className="mb-3">
          <label className="form-label">{t('analysis.monthlyUsage')}</label>
          <input
            className="form-control"
            name="consumo"
            value={datos.consumo}
            onChange={cambiarCampo}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{t('analysis.people')}</label>
          <input
            className="form-control"
            name="personas"
            value={datos.personas}
            onChange={cambiarCampo}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">{t('analysis.devices')}</label>
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
              {t('analysis.submitting')}
            </>
          ) : (
            t('analysis.submit')
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
          <h3>{t('analysis.result')}</h3>

          <h4>
            {t('analysis.level')}:{' '}
            <span className="text-primary">
              {t(`analysis.levels.${resultado.nivelKey}`)}
            </span>
          </h4>

          <h4>
            {t('analysis.estimatedSavings')}:{' '}
            <span className="text-success">{resultado.ahorro}%</span>
          </h4>

          <hr />

          <h5>{t('analysis.tips')}</h5>

          <ul className="mb-0">
            {resultado.tipKeys.map((key) => (
              <li key={key}>{t(`analysis.tipsList.${key}`)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AnalisisIA
