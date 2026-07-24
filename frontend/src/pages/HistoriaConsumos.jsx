import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { LuEye, LuMail } from 'react-icons/lu'
import {
  listMisAnalisis,
  reenviarEmailAnalisis,
} from '../services/historiaConsumosService'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import GraficoHistoriaConsumo from '../components/GraficoHistoriaConsumo'

const LOCALE_TAGS = {
  es: 'es-AR',
  en: 'en-US',
  pt: 'pt-BR',
  fr: 'fr-FR',
  it: 'it-IT',
  de: 'de-DE',
  nl: 'nl-NL',
  pl: 'pl-PL',
  ro: 'ro-RO',
  ca: 'ca-ES',
  tr: 'tr-TR',
}

const REQUEST_FIELDS = [
  {
    key: 'tipoInmueble',
    labelKey: 'analysis.installationType',
    type: 'tipo',
    aliases: ['tipoInmueble', 'tipo_inmueble', 'tipo'],
  },
  {
    key: 'consumoKwh',
    labelKey: 'analysis.monthlyUsage',
    type: 'number',
    suffix: 'kWh',
    aliases: ['consumoKwh', 'consumo_kwh', 'consumo'],
  },
  {
    key: 'areaM2',
    labelKey: 'analysis.homeArea',
    type: 'number',
    suffix: 'm²',
    aliases: ['areaM2', 'area_m2', 'area'],
  },
  {
    key: 'cantidadPersonas',
    labelKey: 'analysis.people',
    type: 'number',
    aliases: ['cantidadPersonas', 'cantidad_personas'],
  },
  {
    key: 'cantidadEquipos',
    labelKey: 'analysis.devices',
    type: 'number',
    aliases: ['cantidadEquipos', 'cantidad_equipos'],
  },
  {
    key: 'horasClimatizacion',
    labelKey: 'analysis.climateHours',
    type: 'number',
    aliases: ['horasClimatizacion', 'horas_climatizacion'],
  },
  {
    key: 'horasAltoConsumo',
    labelKey: 'analysis.peakUseHours',
    type: 'number',
    aliases: ['horasAltoConsumo', 'horas_alto_consumo'],
  },
  {
    key: 'usoHorarioPico',
    labelKey: 'analysis.peakHoursUse',
    type: 'bool',
    aliases: ['usoHorarioPico', 'uso_horario_pico'],
  },
]

/** El backend a veces entrega requestJson como objeto o como string JSON. */
function normalizeRequestJson(raw) {
  if (raw == null || raw === '') return {}
  if (typeof raw === 'string') {
    try {
      return normalizeRequestJson(JSON.parse(raw))
    } catch {
      return {}
    }
  }
  if (typeof raw !== 'object' || Array.isArray(raw)) return {}
  return raw
}

function pickRequestValue(request, field) {
  const keys = field.aliases || [field.key]
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(request, key)) continue
    const value = request[key]
    if (value !== undefined && value !== null && value !== '') return value
    if (value === 0 || value === false) return value
  }
  const wanted = String(field.key).toLowerCase().replace(/_/g, '')
  for (const [key, value] of Object.entries(request)) {
    if (String(key).toLowerCase().replace(/_/g, '') === wanted) {
      if (value !== undefined && value !== null && value !== '') return value
      if (value === 0 || value === false) return value
    }
  }
  return undefined
}

function buildEnteredRequest(detail) {
  const request = { ...normalizeRequestJson(detail?.requestJson ?? detail?.request_json) }
  if (
    detail?.tipoInstalacion &&
    pickRequestValue(request, REQUEST_FIELDS[0]) == null
  ) {
    request.tipoInmueble = detail.tipoInstalacion
  }
  return request
}

function formatDate(value, locale) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString(LOCALE_TAGS[locale] || locale || undefined)
  } catch {
    return String(value)
  }
}

function labelTipo(t, tipo) {
  if (!tipo) return '—'
  const key = `analysis.types.${tipo}`
  const translated = t(key)
  return translated === key ? tipo : translated
}

function labelNivel(t, nivel) {
  if (!nivel) return '—'
  const key = `analysis.levels.${nivel}`
  const translated = t(key)
  return translated === key ? nivel : translated
}

function formatRequestValue(t, field, raw) {
  if (raw == null || raw === '') return '—'
  if (field.type === 'tipo') return labelTipo(t, String(raw))
  if (field.type === 'bool') {
    return raw === true || raw === 'true' || raw === 1 || raw === '1'
      ? t('analysis.yesNo.yes')
      : t('analysis.yesNo.no')
  }
  if (field.type === 'number') {
    const num = Number(raw)
    const text = Number.isFinite(num) ? String(num) : String(raw)
    return field.suffix ? `${text} ${field.suffix}` : text
  }
  return String(raw)
}

function tipKeysFrom(detail) {
  if (Array.isArray(detail?.tipKeys) && detail.tipKeys.length) return detail.tipKeys
  if (Array.isArray(detail?.responseJson?.tipKeys)) return detail.responseJson.tipKeys
  return []
}

function HistoriaConsumos() {
  const { t, locale } = useLocale()
  const { token, openLogin, hydrating } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [detail, setDetail] = useState(null)
  const [mailBusyId, setMailBusyId] = useState(null)
  const [mailMessage, setMailMessage] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      if (!token || String(token).startsWith('mock-token')) {
        setError(t('historiaConsumos.sessionInvalid'))
        setRows([])
        return
      }
      const list = await listMisAnalisis()
      setRows(Array.isArray(list) ? list : [])
    } catch (err) {
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        setError(t('historiaConsumos.sessionInvalid'))
        setRows([])
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            t('historiaConsumos.loadFailed'),
        )
        setRows([])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hydrating) return
    if (!token) {
      setLoading(false)
      setRows([])
      return
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, hydrating])

  async function handleResendEmail(row) {
    if (!row?.id) return
    setMailBusyId(row.id)
    setMailMessage(null)
    try {
      const updated = await reenviarEmailAnalisis(row.id)
      setRows((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, ...updated } : item)),
      )
      if (detail?.id === row.id) {
        setDetail((prev) => (prev ? { ...prev, ...updated } : prev))
      }
      setMailMessage({
        type: 'success',
        text: t('historiaConsumos.emailResent'),
      })
    } catch (err) {
      setMailMessage({
        type: 'danger',
        text:
          err?.response?.data?.message ||
          err?.message ||
          t('historiaConsumos.emailResendFailed'),
      })
    } finally {
      setMailBusyId(null)
    }
  }

  if (!token && !hydrating) {
    return (
      <div className="container-fluid px-0 px-sm-2">
        <h1 className="fs-3 mb-2 text-primary">{t('historiaConsumos.title')}</h1>
        <p className="text-muted">{t('historiaConsumos.loginRequired')}</p>
        <button type="button" className="btn btn-primary btn-sm" onClick={openLogin}>
          {t('common.login')}
        </button>
      </div>
    )
  }

  const request = buildEnteredRequest(detail)
  const tips = tipKeysFrom(detail)
  const enteredRows = REQUEST_FIELDS.map((field) => ({
    field,
    value: pickRequestValue(request, field),
  })).filter(({ value }) => value !== undefined && value !== null && value !== '')

  const extraEntries =
    enteredRows.length === 0
      ? Object.entries(request).filter(
          ([, value]) => value !== undefined && value !== null && value !== '',
        )
      : []

  return (
    <div className="container-fluid px-0 px-sm-2">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
        <div>
          <h1 className="fs-3 mb-1 text-primary">{t('historiaConsumos.title')}</h1>
          <p className="text-muted mb-0">{t('historiaConsumos.subtitle')}</p>
        </div>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={load}
          disabled={loading}
        >
          {t('historiaConsumos.refresh')}
        </button>
      </div>

      {mailMessage && (
        <div className={`alert alert-${mailMessage.type} py-2`} role="alert">
          {mailMessage.text}
        </div>
      )}

      {loading && <Loader mensaje={t('states.loading')} />}

      {!loading && error && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <EmptyState mensaje={t('historiaConsumos.empty')} />
      )}

      {!loading && !error && rows.length > 0 && (
        <>
          <GraficoHistoriaConsumo rows={rows} />
          <div className="card shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>{t('historiaConsumos.createdAt')}</th>
                      <th>{t('historiaConsumos.tipo')}</th>
                      <th>{t('historiaConsumos.nivel')}</th>
                      <th>{t('historiaConsumos.ahorro')}</th>
                      <th>{t('historiaConsumos.emailStatus')}</th>
                      <th className="text-end">{t('historiaConsumos.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td className="small text-nowrap">{formatDate(row.createdAt, locale)}</td>
                        <td>{labelTipo(t, row.tipoInstalacion)}</td>
                        <td>{labelNivel(t, row.nivelKey)}</td>
                        <td>{row.ahorro != null ? `${row.ahorro}%` : '—'}</td>
                        <td>
                          <span className="badge text-bg-secondary">
                            {row.emailStatus
                              ? t(
                                  `common.${String(row.emailStatus).toLowerCase()}`,
                                  row.emailStatus,
                                )
                              : '—'}
                          </span>
                        </td>
                        <td className="text-end text-nowrap">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm me-2 d-inline-flex align-items-center justify-content-center"
                            title={t('historiaConsumos.detail')}
                            aria-label={t('historiaConsumos.detail')}
                            onClick={() => setDetail(row)}
                          >
                            <LuEye size={16} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm d-inline-flex align-items-center justify-content-center"
                            title={t('historiaConsumos.resendEmail')}
                            aria-label={t('historiaConsumos.resendEmail')}
                            disabled={mailBusyId === row.id}
                            onClick={() => handleResendEmail(row)}
                          >
                            {mailBusyId === row.id ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              />
                            ) : (
                              <LuMail size={16} aria-hidden="true" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      <Modal show={Boolean(detail)} onHide={() => setDetail(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5 mb-0">
            {t('historiaConsumos.detailTitle')}
            {detail?.id != null ? ` #${detail.id}` : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detail && (
            <>
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                <div>
                  <p className="mb-1">
                    <strong>{t('historiaConsumos.createdAt')}:</strong>{' '}
                    {formatDate(detail.createdAt, locale)}
                  </p>
                  <p className="mb-1">
                    <strong>{t('historiaConsumos.nivel')}:</strong>{' '}
                    {labelNivel(t, detail.nivelKey)}
                  </p>
                  <p className="mb-1">
                    <strong>{t('historiaConsumos.ahorro')}:</strong>{' '}
                    {detail.ahorro != null ? `${detail.ahorro}%` : '—'}
                  </p>
                  <p className="mb-0">
                    <strong>{t('historiaConsumos.emailStatus')}:</strong>{' '}
                    {detail.emailStatus
                      ? t(
                          `common.${String(detail.emailStatus).toLowerCase()}`,
                          detail.emailStatus,
                        )
                      : '—'}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                  disabled={mailBusyId === detail.id}
                  onClick={() => handleResendEmail(detail)}
                >
                  {mailBusyId === detail.id ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    <LuMail size={16} aria-hidden="true" />
                  )}
                  {t('historiaConsumos.resendEmail')}
                </button>
              </div>

              <h6 className="mb-2">{t('historiaConsumos.enteredData')}</h6>
              {enteredRows.length === 0 && extraEntries.length === 0 ? (
                <p className="small text-muted mb-3">{t('historiaConsumos.noEnteredData')}</p>
              ) : (
                <ul className="list-unstyled small mb-3">
                  {enteredRows.map(({ field, value }) => (
                    <li key={field.key} className="mb-1">
                      <strong>{t(field.labelKey)}:</strong>{' '}
                      {formatRequestValue(t, field, value)}
                    </li>
                  ))}
                  {extraEntries.map(([key, value]) => (
                    <li key={key} className="mb-1">
                      <strong>{key}:</strong> {String(value)}
                    </li>
                  ))}
                </ul>
              )}

              <h6 className="mb-2">{t('historiaConsumos.recommendations')}</h6>
              {tips.length === 0 ? (
                <p className="small text-muted mb-0">{t('historiaConsumos.noTips')}</p>
              ) : (
                <ul className="mb-0 small">
                  {tips.map((key) => (
                    <li key={key}>{t(`analysis.tipsList.${key}`, key)}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default HistoriaConsumos
