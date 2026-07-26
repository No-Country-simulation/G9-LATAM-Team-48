import { useEffect, useState } from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { analizarConsumo, analizarConsumoLocal } from '../services/analisisService'
import { INSTALLATION_TYPES } from '../services/iaService'
import ErrorState from '../components/ErrorState'
import GraficoAnalisisIA from '../components/GraficoAnalisisIA'
import { useLocale } from '../context/LocaleContext'
import { useAuth } from '../context/AuthContext'
import { consumeAnalisisDraft, emptyDraft } from '../utils/analisisDraft'

function FieldHint({ id, text }) {
  if (!text) return null

  return (
    <OverlayTrigger
      placement="top"
      trigger={['hover', 'focus']}
      overlay={<Tooltip id={`field-hint-${id}`}>{text}</Tooltip>}
    >
      <button type="button" className="field-hint-icon" aria-label={text}>
        i
      </button>
    </OverlayTrigger>
  )
}

function Field({ id, label, hint, error, children }) {
  return (
    <div className="mb-2">
      <label
        className="form-label form-label-sm mb-1 d-inline-flex align-items-center"
        htmlFor={id}
      >
        <span>{label}</span>
        <FieldHint id={id} text={hint} />
      </label>
      {children}
      {error && (
        <div className="invalid-feedback d-block" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}

function validateForm(datos, t) {
  const errors = {}
  const consumo = Number(datos.consumoKwh)
  const area = Number(datos.areaM2)
  const personas = Number(datos.cantidadPersonas)
  const climate = Number(datos.horasClimatizacion)
  const peak = Number(datos.horasAltoConsumo)

  if (datos.consumoKwh === '' || !Number.isFinite(consumo) || consumo <= 0) {
    errors.consumoKwh = t(
      'analysis.validation.consumoRequired',
      'Ingresá un consumo mensual mayor a 0.',
    )
  }

  if (datos.areaM2 !== '' && (!Number.isFinite(area) || area < 0)) {
    errors.areaM2 = t('analysis.validation.areaInvalid', 'El área no puede ser negativa.')
  }

  if (datos.cantidadPersonas !== '' && (!Number.isFinite(personas) || personas < 0)) {
    errors.cantidadPersonas = t(
      'analysis.validation.peopleInvalid',
      'La cantidad de personas no puede ser negativa.',
    )
  }

  if (
    datos.horasClimatizacion !== '' &&
    (!Number.isFinite(climate) || climate < 0 || climate > 24)
  ) {
    errors.horasClimatizacion = t(
      'analysis.validation.hoursRange',
      'Usá un valor entre 0 y 24.',
    )
  }

  if (
    datos.horasAltoConsumo !== '' &&
    (!Number.isFinite(peak) || peak < 0 || peak > 24)
  ) {
    errors.horasAltoConsumo = t(
      'analysis.validation.hoursRange',
      'Usá un valor entre 0 y 24.',
    )
  }

  return errors
}

function AnalisisIA() {
  const { t } = useLocale()
  const { isAuthenticated, openLogin, user } = useAuth()
  const [datos, setDatos] = useState(emptyDraft)
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [prefillNotice, setPrefillNotice] = useState(false)

  useEffect(() => {
    const draft = consumeAnalisisDraft()
    if (!draft) return
    setDatos(draft)
    setResultado(null)
    setError(null)
    setFieldErrors({})
    setPrefillNotice(true)
  }, [])

  function cambiarCampo(e) {
    const { name, value, type, checked } = e.target
    setDatos((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setResultado(null)
    setFieldErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  function payloadFromForm() {
    return {
      tipoInmueble: datos.tipoInmueble,
      areaM2: Number(datos.areaM2) || 0,
      consumoKwh: Number(datos.consumoKwh) || 0,
      cantidadEquipos: Number(datos.cantidadEquipos) || 0,
      cantidadPersonas: Number(datos.cantidadPersonas) || 0,
      horasClimatizacion: Number(datos.horasClimatizacion) || 0,
      horasAltoConsumo: Number(datos.horasAltoConsumo) || 0,
      usoHorarioPico: Boolean(datos.usoHorarioPico),
    }
  }

  async function analizar() {
    const errors = validateForm(datos, t)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      setError(null)
      setResultado(null)
      return
    }

    setError(null)
    setResultado(null)
    setLoading(true)
    setPrefillNotice(false)

    const payload = payloadFromForm()

    try {
      // Siempre POST /api/analisis: guarda consulta (anonima o con usuario)
      const respuesta = await analizarConsumo(payload)
      setResultado(respuesta)
    } catch (err) {
      try {
        const local = await analizarConsumoLocal(payload)
        setResultado(local)
        setError(null)
      } catch {
        setError(err?.response?.data?.message || err?.message || t('analysis.failed'))
      }
    } finally {
      setLoading(false)
    }
  }

  const chartDatos = payloadFromForm()
  const isComercial =
    datos.tipoInmueble === INSTALLATION_TYPES.PEQUENO_ESTABLECIMIENTO_COMERCIAL
  const canSubmit = !loading && String(datos.consumoKwh).trim() !== ''

  return (
    <div className="container-fluid px-0 px-sm-2">
      <h1 className="fs-3 fs-md-2 mb-1">{t('analysis.title')}</h1>
      <p className="text-muted mb-2">{t('analysis.subtitle')}</p>
      {!isAuthenticated && (
        <p className="small text-warning mb-3">
          {t('analysis.emailLoginHint')}{' '}
          <button
            type="button"
            className="btn btn-link btn-sm p-0 align-baseline text-primary"
            onClick={openLogin}
          >
            {t('analysis.loginCta')}
          </button>
        </p>
      )}
      {isAuthenticated && user?.email && (
        <p className="small text-muted mb-3">
          {t('analysis.emailHint')} {user.email}
        </p>
      )}
      {prefillNotice && (
        <div className="alert alert-info py-2 small" role="status">
          {t(
            'analysis.prefilledFromHistory',
            'Cargamos los datos de tu consulta anterior. Podés editarlos y analizar de nuevo.',
          )}
        </div>
      )}

      <div className="row g-3 align-items-start">
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm" style={{ maxWidth: 360 }}>
            <div className="card-body p-3">
              <Field
                id="tipoInmueble"
                label={t('analysis.installationType')}
                hint={t('analysis.fieldHints.tipoInmueble')}
              >
                <select
                  id="tipoInmueble"
                  className="form-select form-select-sm"
                  name="tipoInmueble"
                  value={datos.tipoInmueble}
                  onChange={cambiarCampo}
                >
                  {Object.values(INSTALLATION_TYPES).map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {t(`analysis.types.${tipo}`)}
                    </option>
                  ))}
                </select>
              </Field>

              <p className="text-muted small mb-2">
                {t(`analysis.typeHints.${datos.tipoInmueble}`)}
              </p>

              <Field
                id="consumoKwh"
                label={t('analysis.monthlyUsage')}
                hint={t('analysis.fieldHints.consumoKwh')}
                error={fieldErrors.consumoKwh}
              >
                <input
                  id="consumoKwh"
                  className={`form-control form-control-sm${fieldErrors.consumoKwh ? ' is-invalid' : ''}`}
                  name="consumoKwh"
                  type="number"
                  min="0"
                  required
                  aria-invalid={Boolean(fieldErrors.consumoKwh)}
                  aria-describedby={fieldErrors.consumoKwh ? 'consumoKwh-error' : undefined}
                  value={datos.consumoKwh}
                  onChange={cambiarCampo}
                />
              </Field>

              <Field
                id="areaM2"
                label={isComercial ? t('analysis.area') : t('analysis.homeArea')}
                hint={
                  isComercial
                    ? t('analysis.fieldHints.areaCommercial')
                    : t('analysis.fieldHints.areaM2')
                }
                error={fieldErrors.areaM2}
              >
                <input
                  id="areaM2"
                  className={`form-control form-control-sm${fieldErrors.areaM2 ? ' is-invalid' : ''}`}
                  name="areaM2"
                  type="number"
                  min="0"
                  aria-invalid={Boolean(fieldErrors.areaM2)}
                  value={datos.areaM2}
                  onChange={cambiarCampo}
                />
              </Field>

              <Field
                id="cantidadPersonas"
                label={isComercial ? t('analysis.peopleCommercial') : t('analysis.people')}
                hint={
                  isComercial
                    ? t('analysis.fieldHints.cantidadPersonasCommercial')
                    : t('analysis.fieldHints.cantidadPersonas')
                }
                error={fieldErrors.cantidadPersonas}
              >
                <input
                  id="cantidadPersonas"
                  className={`form-control form-control-sm${fieldErrors.cantidadPersonas ? ' is-invalid' : ''}`}
                  name="cantidadPersonas"
                  type="number"
                  min="0"
                  aria-invalid={Boolean(fieldErrors.cantidadPersonas)}
                  value={datos.cantidadPersonas}
                  onChange={cambiarCampo}
                />
              </Field>

              <Field
                id="cantidadEquipos"
                label={t('analysis.devices')}
                hint={t('analysis.fieldHints.cantidadEquipos')}
              >
                <input
                  id="cantidadEquipos"
                  className="form-control form-control-sm"
                  name="cantidadEquipos"
                  type="number"
                  min="0"
                  value={datos.cantidadEquipos}
                  onChange={cambiarCampo}
                />
              </Field>

              <Field
                id="horasClimatizacion"
                label={t('analysis.climateHours')}
                hint={t('analysis.fieldHints.horasClimatizacion')}
                error={fieldErrors.horasClimatizacion}
              >
                <input
                  id="horasClimatizacion"
                  className={`form-control form-control-sm${fieldErrors.horasClimatizacion ? ' is-invalid' : ''}`}
                  name="horasClimatizacion"
                  type="number"
                  min="0"
                  max="24"
                  aria-invalid={Boolean(fieldErrors.horasClimatizacion)}
                  value={datos.horasClimatizacion}
                  onChange={cambiarCampo}
                />
              </Field>

              <Field
                id="horasAltoConsumo"
                label={t('analysis.peakUseHours')}
                hint={t('analysis.fieldHints.horasAltoConsumo')}
                error={fieldErrors.horasAltoConsumo}
              >
                <input
                  id="horasAltoConsumo"
                  className={`form-control form-control-sm${fieldErrors.horasAltoConsumo ? ' is-invalid' : ''}`}
                  name="horasAltoConsumo"
                  type="number"
                  min="0"
                  max="24"
                  aria-invalid={Boolean(fieldErrors.horasAltoConsumo)}
                  value={datos.horasAltoConsumo}
                  onChange={cambiarCampo}
                />
              </Field>

              <div className="form-check form-switch mb-3 ps-0 d-flex align-items-center justify-content-between gap-2">
                <label
                  className="form-check-label small mb-0 d-inline-flex align-items-center"
                  htmlFor="usoHorarioPico"
                >
                  <span>{t('analysis.peakHoursUse')}</span>
                  <FieldHint
                    id="usoHorarioPico"
                    text={t('analysis.fieldHints.usoHorarioPico')}
                  />
                </label>
                <input
                  id="usoHorarioPico"
                  className="form-check-input ms-0 flex-shrink-0"
                  name="usoHorarioPico"
                  type="checkbox"
                  role="switch"
                  checked={Boolean(datos.usoHorarioPico)}
                  onChange={cambiarCampo}
                />
              </div>

              <button
                type="button"
                className="btn btn-primary btn-sm w-100 mt-1"
                onClick={analizar}
                disabled={!canSubmit}
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
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="d-flex flex-column gap-3">
            <GraficoAnalisisIA
              tipo={datos.tipoInmueble}
              consumo={datos.consumoKwh}
              datos={chartDatos}
            />

            {error && <ErrorState mensaje={error} onRetry={analizar} />}

            {!resultado && !error && (
              <div className="card shadow-sm">
                <div className="card-body py-3">
                  <p className="text-muted small mb-0">{t('analysis.panelHint')}</p>
                </div>
              </div>
            )}

            {resultado && (
              <div className="card shadow-sm">
                <div className="card-body p-3">
                  <h5 className="mb-3">{t('analysis.result')}</h5>

                  <p className="mb-2">
                    {t('analysis.level')}:{' '}
                    <span className="text-primary fw-semibold">
                      {t(`analysis.levels.${resultado.nivelKey}`)}
                    </span>
                  </p>

                  <p className="mb-2">
                    {t('analysis.estimatedSavings')}:{' '}
                    <span className="text-success fw-semibold">{resultado.ahorro}%</span>
                  </p>

                  {typeof resultado.confidence === 'number' && (
                    <p className="mb-2 small text-muted">
                      {t('analysis.confidence')}:{' '}
                      <span className="fw-semibold">
                        {Math.round(resultado.confidence * 100)}%
                      </span>
                      {resultado.source === 'ml' || resultado.source === 'api'
                        ? ` · ${t('analysis.sourceMl')}`
                        : ` · ${t('analysis.sourceLocal')}`}
                    </p>
                  )}

                  <h6 className="mb-2 mt-3">{t('analysis.tips')}</h6>
                  <ul className="mb-0 small">
                    {(resultado.tipKeys || []).map((key) => (
                      <li key={key}>{t(`analysis.tipsList.${key}`)}</li>
                    ))}
                  </ul>

                  {isAuthenticated &&
                    (resultado.emailStatus === 'SENT' ||
                      resultado.emailStatus === 'PENDING' ||
                      resultado.emailStatus === 'QUEUED') && (
                      <p className="small text-muted mt-3 mb-0">
                        {resultado.emailStatus === 'SENT'
                          ? t('analysis.emailSent')
                          : t('analysis.emailPending')}
                      </p>
                    )}

                  {!isAuthenticated && (
                    <p className="small text-warning mt-3 mb-0">
                      {t('analysis.emailLoginHint')}{' '}
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 align-baseline text-primary"
                        onClick={openLogin}
                      >
                        {t('analysis.loginCta')}
                      </button>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalisisIA
