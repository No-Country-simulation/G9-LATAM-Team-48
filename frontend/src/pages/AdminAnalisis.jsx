import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { LuEye } from 'react-icons/lu'
import { listAnalisis, recalcularAnalisis } from '../services/adminAnalisisService'
import AnalysisRequestFieldsTable from '../components/AnalysisRequestFieldsTable'
import AnalysisResponsePanel from '../components/AnalysisResponsePanel'
import {
  formatKwh,
  formatM2,
  numericFromRow,
  zonaLabelFromRow,
} from '../utils/analisisRowHelpers'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { useNavigation } from '../context/NavigationContext'
import { isAdmin } from '../utils/roles'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import TablePagination from '../components/TablePagination'
import { DEFAULT_PAGE_SIZE } from '../utils/pageResponse'

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
  const { setPagina } = useNavigation()
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [recalculating, setRecalculating] = useState(false)
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)
  const [detail, setDetail] = useState(null)

  const allowed = isAdmin(user)

  async function load(pageIndex = page, size = pageSize) {
    setLoading(true)
    setError(null)
    try {
      if (!token) {
        setError(t('adminAnalisis.sessionInvalid'))
        setRows([])
        setTotalElements(0)
        setTotalPages(0)
        return
      }

      const current = await refreshUser()
      if (!isAdmin(current)) {
        setError(t('adminAnalisis.forbidden'))
        setRows([])
        setTotalElements(0)
        setTotalPages(0)
        return
      }

      const result = await listAnalisis({ page: pageIndex, size })
      if (
        (!result.content || result.content.length === 0) &&
        pageIndex > 0 &&
        (result.totalElements ?? 0) > 0
      ) {
        await load(pageIndex - 1, size)
        return
      }
      setRows(Array.isArray(result.content) ? result.content : [])
      setPage(result.page ?? pageIndex)
      setTotalPages(result.totalPages ?? 0)
      setTotalElements(result.totalElements ?? 0)
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

  function handlePageChange(nextPage) {
    load(nextPage, pageSize)
  }

  function handlePageSizeChange(nextSize) {
    setPageSize(nextSize)
    load(0, nextSize)
  }

  useEffect(() => {
    if (hydrating) return
    if (!token) {
      setLoading(false)
      setRows([])
      return
    }
    load(0, pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, hydrating])

  async function handleRelogin() {
    await logout()
    openLogin()
  }

  async function handleRecalcular() {
    if (!allowed || recalculating) return
    const confirmed = window.confirm(t('adminAnalisis.recalculateConfirm'))
    if (!confirmed) return

    setRecalculating(true)
    setError(null)
    setInfo(null)
    try {
      const result = await recalcularAnalisis()
      setInfo(
        t('adminAnalisis.recalculateDone')
          .replace('{total}', String(result.total ?? 0))
          .replace('{updated}', String(result.updated ?? 0))
          .replace('{unchanged}', String(result.unchanged ?? 0))
          .replace('{skipped}', String(result.skipped ?? 0)),
      )
      await load()
    } catch (err) {
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        setError(t('adminAnalisis.sessionInvalid'))
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            t('adminAnalisis.recalculateFailed'),
        )
      }
    } finally {
      setRecalculating(false)
    }
  }

  if (!token && !hydrating) {
    return (
      <div className="container-fluid px-0 px-sm-2">
        <h1 className="fs-3 mb-2 text-primary">{t('adminAnalisis.title')}</h1>
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
          <h1 className="fs-3 fs-md-2 mb-1 text-primary">{t('adminAnalisis.title')}</h1>
          <p className="text-muted mb-0">{t('adminAnalisis.subtitle')}</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => load(page, pageSize)}
            disabled={!allowed || loading || hydrating || recalculating}
          >
            {t('adminAnalisis.refresh')}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleRecalcular}
            disabled={!allowed || loading || hydrating || recalculating}
          >
            {recalculating
              ? t('adminAnalisis.recalculating')
              : t('adminAnalisis.recalculate')}
          </button>
        </div>
      </div>

      {(loading || hydrating) && <Loader mensaje={t('states.loading')} />}

      {!loading && !hydrating && info && (
        <div className="alert alert-success py-2">{info}</div>
      )}

      {!loading && !hydrating && error && (
        <div className="alert alert-danger">
          <div className="mb-2">{error}</div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => load(page, pageSize)}>
              {t('states.retry')}
            </button>
            <button type="button" className="btn btn-sm btn-primary" onClick={handleRelogin}>
              {t('common.login')}
            </button>
          </div>
        </div>
      )}

      {!loading && !hydrating && !error && totalElements === 0 && (
        <EmptyState
          mensaje={t('adminAnalisis.empty', 'Todavía no hay análisis guardados.')}
          actionLabel={t('adminAnalisis.goToAnalysis', 'Ir a Análisis IA')}
          onAction={() => setPagina('ia')}
        />
      )}

      {!loading && !hydrating && !error && totalElements > 0 && (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{t('adminAnalisis.email')}</th>
                    <th>{t('adminAnalisis.tipo')}</th>
                    <th>{t('adminAnalisis.consumoMensual')}</th>
                    <th className="d-none d-md-table-cell">
                      {t('adminAnalisis.consumoAnterior')}
                    </th>
                    <th className="d-none d-lg-table-cell">{t('adminAnalisis.zona')}</th>
                    <th className="d-none d-xl-table-cell">{t('adminAnalisis.superficie')}</th>
                    <th>{t('adminAnalisis.nivel')}</th>
                    <th>{t('adminAnalisis.ahorro')}</th>
                    <th className="d-none d-md-table-cell">{t('adminAnalisis.confidence')}</th>
                    <th>{t('adminAnalisis.createdAt')}</th>
                    <th className="text-end">{t('adminAnalisis.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td className="small">{row.userEmail || t('adminAnalisis.anonymous')}</td>
                      <td>{labelTipo(t, row.tipoInstalacion)}</td>
                      <td>{formatKwh(numericFromRow(row, 'consumoKwh'))}</td>
                      <td className="d-none d-md-table-cell">
                        {formatKwh(numericFromRow(row, 'consumoKwhMesAnterior'))}
                      </td>
                      <td className="d-none d-lg-table-cell small">
                        {zonaLabelFromRow(row, t)}
                      </td>
                      <td className="d-none d-xl-table-cell">
                        {formatM2(numericFromRow(row, 'areaM2'))}
                      </td>
                      <td>{labelNivel(t, row.nivelKey)}</td>
                      <td>{row.ahorro != null ? `${row.ahorro}%` : '—'}</td>
                      <td className="d-none d-md-table-cell">
                        {row.confidence != null
                          ? `${Math.round(Number(row.confidence) * 100)}%`
                          : '—'}
                      </td>
                      <td className="small text-nowrap">{formatDate(row.createdAt, locale)}</td>
                      <td className="text-end text-nowrap">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm d-inline-flex align-items-center justify-content-center"
                          title={t('adminAnalisis.detail')}
                          aria-label={t('adminAnalisis.detail')}
                          onClick={() => setDetail(row)}
                        >
                          <LuEye size={16} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              t={t}
              idPrefix="admin-analisis"
            />
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
                  <strong>{t('adminAnalisis.email')}:</strong>{' '}
                  {detail.userEmail || t('adminAnalisis.anonymous')}
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
                <div className="fw-semibold mb-2">{t('adminAnalisis.request')}</div>
                <AnalysisRequestFieldsTable
                  request={detail.requestJson ?? {}}
                  t={t}
                />
              </div>
              <div>
                <div className="fw-semibold mb-2">{t('adminAnalisis.response')}</div>
                <AnalysisResponsePanel
                  response={detail.responseJson ?? {}}
                  row={detail}
                  t={t}
                />
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default AdminAnalisis
