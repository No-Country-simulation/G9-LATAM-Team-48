import { useState } from 'react'
import { analizarConsumoAutenticado } from '../services/analisisService'
import { INSTALLATION_TYPES } from '../services/iaService'
import ErrorState from '../components/ErrorState'
import GraficoAnalisisIA from '../components/GraficoAnalisisIA'
import { useLocale } from '../context/LocaleContext'
import { useAuth } from '../context/AuthContext'

const initialState = {
  tipo: INSTALLATION_TYPES.casa,
  consumo: '',
  personas: '',
  equipos: '',
  area: '',
  climateHours: '',
  peakUseHours: '',
  turnos: '',
  maquinas: '',
  hoursPerDay: '',
  hasCompressedAir: 'no',
  processIntensity: 'media',
  lineas: '',
  operatingDays: '',
  capacityPct: '',
  hasMonitoring: 'no',
}

function Field({ id, label, children }) {
  return (
    <div className="mb-2">
      <label className="form-label form-label-sm mb-1" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  )
}

function AnalisisIA() {
  const { t } = useLocale()
  const { isAuthenticated, openLogin, user } = useAuth()
  const [datos, setDatos] = useState(initialState)
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function cambiarCampo(e) {
    const { name, value } = e.target
    setDatos((prev) => ({ ...prev, [name]: value }))
    setResultado(null)
  }

  function payloadFromForm() {
    const base = {
      tipo: datos.tipo,
      consumo: Number(datos.consumo) || 0,
    }

    if (datos.tipo === INSTALLATION_TYPES.casa) {
      return {
        ...base,
        personas: Number(datos.personas) || 0,
        equipos: Number(datos.equipos) || 0,
        area: Number(datos.area) || 0,
        climateHours: Number(datos.climateHours) || 0,
        peakUseHours: Number(datos.peakUseHours) || 0,
      }
    }

    if (datos.tipo === INSTALLATION_TYPES.fabrica_mediana) {
      return {
        ...base,
        turnos: Number(datos.turnos) || 0,
        maquinas: Number(datos.maquinas) || 0,
        area: Number(datos.area) || 0,
        hoursPerDay: Number(datos.hoursPerDay) || 0,
        hasCompressedAir: datos.hasCompressedAir,
        processIntensity: datos.processIntensity,
      }
    }

    return {
      ...base,
      lineas: Number(datos.lineas) || 0,
      maquinas: Number(datos.maquinas) || 0,
      turnos: Number(datos.turnos) || 0,
      area: Number(datos.area) || 0,
      operatingDays: Number(datos.operatingDays) || 0,
      capacityPct: Number(datos.capacityPct) || 0,
      hasMonitoring: datos.hasMonitoring,
      hasCompressedAir: datos.hasCompressedAir,
    }
  }

  async function analizar() {
    if (!isAuthenticated) {
      openLogin()
      setError(t('analysis.loginRequired'))
      return
    }

    setError(null)
    setResultado(null)
    setLoading(true)

    try {
      const respuesta = await analizarConsumoAutenticado(payloadFromForm())
      setResultado(respuesta)
    } catch (err) {
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        openLogin()
        setError(t('analysis.loginRequired'))
      } else {
        setError(err?.response?.data?.message || err?.message || t('analysis.failed'))
      }
    } finally {
      setLoading(false)
    }
  }

  const isCasa = datos.tipo === INSTALLATION_TYPES.casa
  const isMediana = datos.tipo === INSTALLATION_TYPES.fabrica_mediana
  const isGrande = datos.tipo === INSTALLATION_TYPES.fabrica_grande
  const chartDatos = payloadFromForm()

  return (
    <div className="container-fluid px-0 px-sm-2">
      <h1 className="fs-3 fs-md-2 mb-1">{t('analysis.title')}</h1>
      <p className="text-muted mb-2">{t('analysis.subtitle')}</p>
      {!isAuthenticated && (
        <p className="small text-warning mb-3">
          {t('analysis.loginRequired')}{' '}
          <button
            type="button"
            className="btn btn-link btn-sm p-0 align-baseline"
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

      <div className="row g-3 align-items-start">
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm" style={{ maxWidth: 360 }}>
            <div className="card-body p-3">
              <Field id="tipo" label={t('analysis.installationType')}>
                <select
                  id="tipo"
                  className="form-select form-select-sm"
                  name="tipo"
                  value={datos.tipo}
                  onChange={cambiarCampo}
                >
                  <option value={INSTALLATION_TYPES.casa}>
                    {t('analysis.types.casa')}
                  </option>
                  <option value={INSTALLATION_TYPES.fabrica_mediana}>
                    {t('analysis.types.fabrica_mediana')}
                  </option>
                  <option value={INSTALLATION_TYPES.fabrica_grande}>
                    {t('analysis.types.fabrica_grande')}
                  </option>
                </select>
              </Field>

              <p className="text-muted small mb-2">
                {t(`analysis.typeHints.${datos.tipo}`)}
              </p>

              <Field id="consumo" label={t('analysis.monthlyUsage')}>
                <input
                  id="consumo"
                  className="form-control form-control-sm"
                  name="consumo"
                  type="number"
                  min="0"
                  value={datos.consumo}
                  onChange={cambiarCampo}
                />
              </Field>

              {isCasa && (
                <>
                  <Field id="personas" label={t('analysis.people')}>
                    <input
                      id="personas"
                      className="form-control form-control-sm"
                      name="personas"
                      type="number"
                      min="0"
                      value={datos.personas}
                      onChange={cambiarCampo}
                    />
                  </Field>
                  <Field id="equipos" label={t('analysis.devices')}>
                    <input
                      id="equipos"
                      className="form-control form-control-sm"
                      name="equipos"
                      type="number"
                      min="0"
                      value={datos.equipos}
                      onChange={cambiarCampo}
                    />
                  </Field>
                  <Field id="area" label={t('analysis.homeArea')}>
                    <input
                      id="area"
                      className="form-control form-control-sm"
                      name="area"
                      type="number"
                      min="0"
                      value={datos.area}
                      onChange={cambiarCampo}
                    />
                  </Field>
                  <Field id="climateHours" label={t('analysis.climateHours')}>
                    <input
                      id="climateHours"
                      className="form-control form-control-sm"
                      name="climateHours"
                      type="number"
                      min="0"
                      max="24"
                      value={datos.climateHours}
                      onChange={cambiarCampo}
                    />
                  </Field>
                  <Field id="peakUseHours" label={t('analysis.peakUseHours')}>
                    <input
                      id="peakUseHours"
                      className="form-control form-control-sm"
                      name="peakUseHours"
                      type="number"
                      min="0"
                      max="24"
                      value={datos.peakUseHours}
                      onChange={cambiarCampo}
                    />
                  </Field>
                </>
              )}

              {isMediana && (
                <>
                  <Field id="turnos" label={t('analysis.shifts')}>
                    <input
                      id="turnos"
                      className="form-control form-control-sm"
                      name="turnos"
                      type="number"
                      min="0"
                      value={datos.turnos}
                      onChange={cambiarCampo}
                    />
                  </Field>
                  <Field id="maquinas" label={t('analysis.machines')}>
                    <input
                      id="maquinas"
                      className="form-control form-control-sm"
                      name="maquinas"
                      type="number"
                      min="0"
                      value={datos.maquinas}
                      onChange={cambiarCampo}
                    />
                  </Field>
                  <Field id="area" label={t('analysis.area')}>
                    <input
                      id="area"
                      className="form-control form-control-sm"
                      name="area"
                      type="number"
                      min="0"
                      value={datos.area}
                      onChange={cambiarCampo}
                    />
                  </Field>
                  <Field id="hoursPerDay" label={t('analysis.hoursPerDay')}>
                    <input
                      id="hoursPerDay"
                      className="form-control form-control-sm"
                      name="hoursPerDay"
                      type="number"
                      min="0"
                      max="24"
                      value={datos.hoursPerDay}
                      onChange={cambiarCampo}
                    />
                  </Field>
                  <Field id="processIntensity" label={t('analysis.processIntensity')}>
                    <select
                      id="processIntensity"
                      className="form-select form-select-sm"
                      name="processIntensity"
                      value={datos.processIntensity}
                      onChange={cambiarCampo}
                    >
                      <option value="baja">{t('analysis.intensity.baja')}</option>
                      <option value="media">{t('analysis.intensity.media')}</option>
                      <option value="alta">{t('analysis.intensity.alta')}</option>
                    </select>
                  </Field>
                  <Field id="hasCompressedAir" label={t('analysis.hasCompressedAir')}>
                    <select
                      id="hasCompressedAir"
                      className="form-select form-select-sm"
                      name="hasCompressedAir"
                      value={datos.hasCompressedAir}
                      onChange={cambiarCampo}
                    >
                      <option value="no">{t('analysis.yesNo.no')}</option>
                      <option value="yes">{t('analysis.yesNo.yes')}</option>
                    </select>
                  </Field>
                </>
              )}

              {isGrande && (
                <>
                  <Field id="lineas" label={t('analysis.lines')}>
                    <input
                      id="lineas"
                      className="form-control form-control-sm"
                      name="lineas"
                      type="number"
                      min="0"
                      value={datos.lineas}
                      onChange={cambiarCampo}
                    />
                  </Field>
                  <Field id="maquinas" label={t('analysis.machines')}>
                    <input
                      id="maquinas"
                      className="form-control form-control-sm"
                      name="maquinas"
                      type="number"
                      min="0"
                      value={datos.maquinas}
                      onChange={cambiarCampo}
                    />
                  </Field>
                  <Field id="turnos" label={t('analysis.shifts')}>
                    <input
                      id="turnos"
                      className="form-control form-control-sm"
                      name="turnos"
                      type="number"
                      min="0"
                      value={datos.turnos}
                      onChange={cambiarCampo}
                    />
                  </Field>
                  <Field id="area" label={t('analysis.area')}>
                    <input
                      id="area"
                      className="form-control form-control-sm"
                      name="area"
                      type="number"
                      min="0"
                      value={datos.area}
                      onChange={cambiarCampo}
                    />
                  </Field>
                  <Field id="operatingDays" label={t('analysis.operatingDays')}>
                    <input
                      id="operatingDays"
                      className="form-control form-control-sm"
                      name="operatingDays"
                      type="number"
                      min="0"
                      max="31"
                      value={datos.operatingDays}
                      onChange={cambiarCampo}
                    />
                  </Field>
                  <Field id="capacityPct" label={t('analysis.capacityPct')}>
                    <input
                      id="capacityPct"
                      className="form-control form-control-sm"
                      name="capacityPct"
                      type="number"
                      min="0"
                      max="100"
                      value={datos.capacityPct}
                      onChange={cambiarCampo}
                    />
                  </Field>
                  <Field id="hasMonitoring" label={t('analysis.hasMonitoring')}>
                    <select
                      id="hasMonitoring"
                      className="form-select form-select-sm"
                      name="hasMonitoring"
                      value={datos.hasMonitoring}
                      onChange={cambiarCampo}
                    >
                      <option value="no">{t('analysis.yesNo.no')}</option>
                      <option value="yes">{t('analysis.yesNo.yes')}</option>
                    </select>
                  </Field>
                  <Field id="hasCompressedAir" label={t('analysis.hasCompressedAir')}>
                    <select
                      id="hasCompressedAir"
                      className="form-select form-select-sm"
                      name="hasCompressedAir"
                      value={datos.hasCompressedAir}
                      onChange={cambiarCampo}
                    >
                      <option value="no">{t('analysis.yesNo.no')}</option>
                      <option value="yes">{t('analysis.yesNo.yes')}</option>
                    </select>
                  </Field>
                </>
              )}

              <button
                className="btn btn-primary btn-sm w-100 mt-1"
                onClick={analizar}
                disabled={loading || !datos.consumo}
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
              tipo={datos.tipo}
              consumo={datos.consumo}
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

                  {resultado.emailStatus && (
                    <p className="small text-muted mt-3 mb-0">
                      {resultado.emailStatus === 'SENT'
                        ? t('analysis.emailSent')
                        : t('analysis.emailPending')}
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
