import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { LuEye, LuMail, LuRotateCcw } from 'react-icons/lu'
import {
  listMisAnalisis,
  reenviarEmailAnalisis,
} from '../services/historiaConsumosService'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { useNavigation } from '../context/NavigationContext'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import GraficoHistoriaConsumo from '../components/GraficoHistoriaConsumo'
import GraficosHistoriaExtra from '../components/GraficosHistoriaExtra'
import AnalysisRequestFieldsTable from '../components/AnalysisRequestFieldsTable'
import { draftFromRequest, saveAnalisisDraft } from '../utils/analisisDraft'
import {
  ML_REQUEST_FIELD_DEFS,
  pickRequestFieldValue,
} from '../utils/analisisMlContract'
import {
  formatKwh,
  formatM2,
  numericFromRow,
  zonaLabelFromRow,
} from '../utils/analisisRowHelpers'

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

function buildEnteredRequest(detail) {
  const request = { ...normalizeRequestJson(detail?.requestJson ?? detail?.request_json) }
  if (
    detail?.tipoInstalacion &&
    pickRequestFieldValue(request, ML_REQUEST_FIELD_DEFS[0]) == null
  ) {
    request.tipoInmueble = detail.tipoInstalacion
  }
  return request
}

function consumoFromRow(row) {
  return numericFromRow(row, 'consumoKwh')
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

function tipKeysFrom(detail) {
  if (Array.isArray(detail?.tipKeys) && detail.tipKeys.length) return detail.tipKeys
  if (Array.isArray(detail?.responseJson?.tipKeys)) return detail.responseJson.tipKeys
  return []
}

function HistoriaConsumos() {
  const { t, locale } = useLocale()
  const { token, isAuthenticated, openLogin, hydrating } = useAuth()
  const { setPagina } = useNavigation()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [detail, setDetail] = useState(null)
  const [mailBusyId, setMailBusyId] = useState(null)
  const [mailMessage, setMailMessage] = useState(null)

  function goToAnalisis() {
    setPagina('ia')
  }

  function handleRepeatAnalysis(row) {
    const draft = draftFromRequest(row?.requestJson || {})
    saveAnalisisDraft(draft)
    setDetail(null)
    setPagina('ia')
  }

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
    if (!isAuthenticated || !token) {
      setLoading(false)
      setRows([])
      setPagina('dashboard')
      return
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, hydrating, isAuthenticated])

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
        <EmptyState
          mensaje={t('historiaConsumos.empty')}
          actionLabel={t('historiaConsumos.goToAnalysis', 'Ir a Análisis IA')}
          onAction={goToAnalisis}
        />
      )}

      {!loading && !error && rows.length > 0 && (
        <>
          <GraficoHistoriaConsumo
            points={rows
              .map((row) => {
                const consumo = consumoFromRow(row)
                if (consumo == null) return null
                return {
                  id: row.id,
                  createdAt: row.createdAt,
                  consumo,
                }
              })
              .filter(Boolean)}
          />
          <GraficosHistoriaExtra
            points={rows.map((row) => ({
              id: row.id,
              createdAt: row.createdAt,
              ahorro: row.ahorro,
              nivelKey: row.nivelKey,
            }))}
          />
          <div className="card shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>{t('historiaConsumos.createdAt')}</th>
                      <th>{t('historiaConsumos.tipo')}</th>
                      <th>{t('historiaConsumos.consumoMensual')}</th>
                      <th className="d-none d-md-table-cell">
                        {t('historiaConsumos.consumoAnterior')}
                      </th>
                      <th className="d-none d-lg-table-cell">{t('historiaConsumos.zona')}</th>
                      <th className="d-none d-xl-table-cell">
                        {t('historiaConsumos.superficie')}
                      </th>
                      <th>{t('historiaConsumos.nivel')}</th>
                      <th>{t('historiaConsumos.ahorro')}</th>
                      <th className="text-end">{t('historiaConsumos.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const consumo = consumoFromRow(row)
                      const consumoPrev = numericFromRow(row, 'consumoKwhMesAnterior')
                      const superficie = numericFromRow(row, 'areaM2')
                      return (
                      <tr key={row.id}>
                        <td className="small text-nowrap">{formatDate(row.createdAt, locale)}</td>
                        <td>{labelTipo(t, row.tipoInstalacion)}</td>
                        <td>{formatKwh(consumo)}</td>
                        <td className="d-none d-md-table-cell">{formatKwh(consumoPrev)}</td>
                        <td className="d-none d-lg-table-cell small">
                          {zonaLabelFromRow(row, t)}
                        </td>
                        <td className="d-none d-xl-table-cell">{formatM2(superficie)}</td>
                        <td>{labelNivel(t, row.nivelKey)}</td>
                        <td>{row.ahorro != null ? `${row.ahorro}%` : '—'}</td>
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
                      )
                    })}
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

              <h6 className="mb-3">{t('historiaConsumos.enteredData')}</h6>
              <AnalysisRequestFieldsTable request={request} t={t} showMlKey />

              <h6 className="mb-2 mt-3">{t('historiaConsumos.recommendations')}</h6>
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
        {detail && (
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
              onClick={() => handleRepeatAnalysis(detail)}
            >
              <LuRotateCcw size={16} aria-hidden="true" />
              {t('historiaConsumos.repeatAnalysis', 'Repetir análisis')}
            </button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  )
}

export default HistoriaConsumos
