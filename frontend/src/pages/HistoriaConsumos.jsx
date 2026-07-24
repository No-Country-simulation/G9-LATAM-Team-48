import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { listMisAnalisis } from '../services/historiaConsumosService'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'

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

function HistoriaConsumos() {
  const { t, locale } = useLocale()
  const { token, openLogin, hydrating } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [detail, setDetail] = useState(null)

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

  if (!token && !hydrating) {
    return (
      <div className="container-fluid px-0 px-sm-2">
        <h1 className="fs-3 mb-2">{t('historiaConsumos.title')}</h1>
        <p className="text-muted">{t('historiaConsumos.loginRequired')}</p>
        <button type="button" className="btn btn-primary btn-sm" onClick={openLogin}>
          {t('common.login')}
        </button>
      </div>
    )
  }

  return (
    <div className="container-fluid px-0 px-sm-2">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
        <div>
          <h1 className="fs-3 mb-1">{t('historiaConsumos.title')}</h1>
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
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setDetail(row)}
                        >
                          {t('historiaConsumos.detail')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
              <p className="mb-2">
                <strong>{t('historiaConsumos.createdAt')}:</strong>{' '}
                {formatDate(detail.createdAt, locale)}
              </p>
              <p className="mb-2">
                <strong>{t('historiaConsumos.tipo')}:</strong>{' '}
                {labelTipo(t, detail.tipoInstalacion)}
              </p>
              <p className="mb-2">
                <strong>{t('historiaConsumos.nivel')}:</strong>{' '}
                {labelNivel(t, detail.nivelKey)}
              </p>
              <p className="mb-2">
                <strong>{t('historiaConsumos.ahorro')}:</strong>{' '}
                {detail.ahorro != null ? `${detail.ahorro}%` : '—'}
              </p>
              <p className="mb-3">
                <strong>{t('historiaConsumos.emailStatus')}:</strong>{' '}
                {detail.emailStatus
                  ? t(`common.${String(detail.emailStatus).toLowerCase()}`, detail.emailStatus)
                  : '—'}
              </p>
              <h6 className="mb-2">{t('historiaConsumos.request')}</h6>
              <pre className="bg-body-secondary p-2 rounded small overflow-auto">
                {JSON.stringify(detail.requestJson ?? {}, null, 2)}
              </pre>
              <h6 className="mb-2 mt-3">{t('historiaConsumos.response')}</h6>
              <pre className="bg-body-secondary p-2 rounded small overflow-auto mb-0">
                {JSON.stringify(detail.responseJson ?? {}, null, 2)}
              </pre>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default HistoriaConsumos
