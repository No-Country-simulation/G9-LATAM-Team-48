import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { listAnalisis } from '../services/adminAnalisisService'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { isAdmin } from '../utils/roles'
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

function AdminAnalisis() {
  const { t, locale } = useLocale()
  const { user, token, openLogin, refreshUser, logout, hydrating } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [detail, setDetail] = useState(null)

  const allowed = isAdmin(user)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      if (!token || String(token).startsWith('mock-token')) {
        setError(t('adminAnalisis.sessionInvalid'))
        setRows([])
        return
      }

      const current = await refreshUser()
      if (!isAdmin(current)) {
        setError(t('adminAnalisis.forbidden'))
        setRows([])
        return
      }

      const list = await listAnalisis()
      setRows(Array.isArray(list) ? list : [])
    } catch (err) {
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        setError(t('adminAnalisis.sessionInvalid'))
        setRows([])
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            t('adminAnalisis.loadFailed'),
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

  async function handleRelogin() {
    await logout()
    openLogin()
  }

  if (!token && !hydrating) {
    return (
      <div className="container-fluid px-0 px-sm-2">
        <h1 className="fs-3 mb-2">{t('adminAnalisis.title')}</h1>
        <p className="text-muted">{t('adminAnalisis.loginRequired')}</p>
        <button type="button" className="btn btn-primary btn-sm" onClick={openLogin}>
          {t('common.login')}
        </button>
      </div>
    )
  }

  return (
    <div className="container-fluid px-0 px-sm-2">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-2 mb-3">
        <div>
          <h1 className="fs-3 fs-md-2 mb-1">{t('adminAnalisis.title')}</h1>
          <p className="text-muted mb-0">{t('adminAnalisis.subtitle')}</p>
        </div>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={load}
          disabled={!allowed || loading || hydrating}
        >
          {t('adminAnalisis.refresh')}
        </button>
      </div>

      {(loading || hydrating) && <Loader mensaje={t('states.loading')} />}

      {!loading && !hydrating && error && (
        <div className="alert alert-danger">
          <div className="mb-2">{error}</div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={load}>
              {t('states.retry')}
            </button>
            <button type="button" className="btn btn-sm btn-primary" onClick={handleRelogin}>
              {t('common.login')}
            </button>
          </div>
        </div>
      )}

      {!loading && !hydrating && !error && rows.length === 0 && <EmptyState />}

      {!loading && !hydrating && !error && rows.length > 0 && (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{t('adminAnalisis.email')}</th>
                    <th>{t('adminAnalisis.tipo')}</th>
                    <th>{t('adminAnalisis.nivel')}</th>
                    <th>{t('adminAnalisis.ahorro')}</th>
                    <th>{t('adminAnalisis.confidence')}</th>
                    <th>{t('adminAnalisis.emailStatus')}</th>
                    <th>{t('adminAnalisis.createdAt')}</th>
                    <th className="text-end">{t('adminAnalisis.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.userEmail}</td>
                      <td>{labelTipo(t, row.tipoInstalacion)}</td>
                      <td>{labelNivel(t, row.nivelKey)}</td>
                      <td>{row.ahorro != null ? `${row.ahorro}%` : '—'}</td>
                      <td>
                        {row.confidence != null
                          ? `${Math.round(Number(row.confidence) * 100)}%`
                          : '—'}
                      </td>
                      <td>
                        <span className="badge text-bg-secondary">
                          {row.emailStatus || '—'}
                        </span>
                      </td>
                      <td className="small text-nowrap">{formatDate(row.createdAt, locale)}</td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setDetail(row)}
                        >
                          {t('adminAnalisis.detail')}
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
            {t('adminAnalisis.detailTitle')} #{detail?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detail && (
            <div className="d-grid gap-3">
              <div className="small">
                <div>
                  <strong>{t('adminAnalisis.email')}:</strong> {detail.userEmail}
                </div>
                <div>
                  <strong>{t('adminAnalisis.tipo')}:</strong>{' '}
                  {labelTipo(t, detail.tipoInstalacion)}
                </div>
                <div>
                  <strong>{t('adminAnalisis.nivel')}:</strong>{' '}
                  {labelNivel(t, detail.nivelKey)}
                </div>
                <div>
                  <strong>{t('adminAnalisis.createdAt')}:</strong>{' '}
                  {formatDate(detail.createdAt, locale)}
                </div>
              </div>
              <div>
                <div className="fw-semibold mb-1">{t('adminAnalisis.request')}</div>
                <pre className="bg-body-tertiary p-2 rounded small mb-0 overflow-auto" style={{ maxHeight: 220 }}>
                  {JSON.stringify(detail.requestJson ?? {}, null, 2)}
                </pre>
              </div>
              <div>
                <div className="fw-semibold mb-1">{t('adminAnalisis.response')}</div>
                <pre className="bg-body-tertiary p-2 rounded small mb-0 overflow-auto" style={{ maxHeight: 220 }}>
                  {JSON.stringify(detail.responseJson ?? {}, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default AdminAnalisis
