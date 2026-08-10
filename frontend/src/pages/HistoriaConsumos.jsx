import { useEffect, useMemo, useState, useCallback } from 'react'
import Modal from 'react-bootstrap/Modal'
import { LuEye, LuMail, LuRotateCcw } from 'react-icons/lu'
import {
  listMisAnalisis,
  listMisAnalisisChartPoints,
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
import AnalysisTipsTable from '../components/AnalysisTipsTable'
import TablePagination from '../components/TablePagination'
import CardConsumo from '../components/CardConsumo'
import { useHistoriaFilters } from '../context/HistoriaFiltersContext'
import { DEFAULT_PAGE_SIZE } from '../utils/pageResponse'
import { draftFromRequest, saveAnalisisDraft } from '../utils/analisisDraft'
import {
  ML_REQUEST_FIELD_DEFS,
  pickRequestFieldValue,
} from '../utils/analisisMlContract'
import {
  historiaRowIdsEqual,
  pageIndexForHistoriaRow,
} from '../utils/historiaChartInteraction'
import {
  calcHistoriaKpis,
  consumoFromHistoriaItem,
  filterHistoriaItems,
  hasActiveHistoriaFilters,
} from '../utils/historiaConsumoFilters'
import {
  formatKwh,
  formatM2,
  numericFromRow,
  zonaLabelFromRow,
} from '../utils/analisisRowHelpers'

const MAX_HISTORIA_ROWS = 500

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
  return consumoFromHistoriaItem(row)
}

function toChartPointRow(row) {
  return {
    id: row.id,
    createdAt: row.createdAt,
    consumo: row.consumoKwh ?? consumoFromHistoriaItem(row),
    consumoKwh: row.consumoKwh ?? consumoFromHistoriaItem(row),
    ahorro: row.ahorro,
    nivelKey: row.nivelKey,
    tipoInstalacion: row.tipoInstalacion,
    zona: row.zona,
    requestJson: row.requestJson,
  }
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
  const { filters, setFiltersVisible } = useHistoriaFilters()
  const [rows, setRows] = useState([])
  const [chartPoints, setChartPoints] = useState([])
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [detail, setDetail] = useState(null)
  const [mailBusyId, setMailBusyId] = useState(null)
  const [mailMessage, setMailMessage] = useState(null)
  const [highlightedRowId, setHighlightedRowId] = useState(null)

  function goToAnalisis() {
    setPagina('ia')
  }

  function handleRepeatAnalysis(row) {
    const draft = draftFromRequest(row?.requestJson || {})
    saveAnalisisDraft(draft)
    setDetail(null)
    setPagina('ia')
  }

  useEffect(() => {
    setFiltersVisible(totalElements > 0)
    return () => setFiltersVisible(false)
  }, [totalElements, setFiltersVisible])

  useEffect(() => {
    setPage(0)
    setHighlightedRowId(null)
  }, [filters])

  async function loadChartPoints() {
    try {
      const points = await listMisAnalisisChartPoints()
      setChartPoints(Array.isArray(points) ? points : [])
    } catch {
      setChartPoints([])
    }
  }

  async function loadTable() {
    setLoading(true)
    setError(null)
    try {
      if (!token) {
        setError(t('historiaConsumos.sessionInvalid'))
        setRows([])
        setTotalElements(0)
        return
      }
      const result = await listMisAnalisis({ page: 0, size: MAX_HISTORIA_ROWS })
      setRows(Array.isArray(result.content) ? result.content : [])
      setTotalElements(result.totalElements ?? result.content?.length ?? 0)
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

  async function loadAll() {
    void loadChartPoints()
    await loadTable()
  }

  function handlePageChange(nextPage) {
    setPage(nextPage)
  }

  function handlePageSizeChange(nextSize) {
    setPageSize(nextSize)
    setPage(0)
  }

  const seriesSource = useMemo(() => {
    if (chartPoints.length > 0) {
      return chartPoints.map((row) => ({
        id: row.id,
        createdAt: row.createdAt,
        consumo: row.consumoKwh ?? row.consumo,
        consumoKwh: row.consumoKwh,
        ahorro: row.ahorro,
        nivelKey: row.nivelKey,
        tipoInstalacion: row.tipoInstalacion,
        zona: row.zona,
      }))
    }
    return rows.map(toChartPointRow)
  }, [chartPoints, rows])

  const filteredSeries = useMemo(
    () => filterHistoriaItems(seriesSource, filters),
    [seriesSource, filters],
  )

  const filteredRows = useMemo(
    () => filterHistoriaItems(rows, filters),
    [rows, filters],
  )

  const kpis = useMemo(() => calcHistoriaKpis(filteredSeries), [filteredSeries])

  const pagedRows = useMemo(() => {
    const start = page * pageSize
    return filteredRows.slice(start, start + pageSize)
  }, [filteredRows, page, pageSize])

  const filteredTotalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize) || 1)
  const filtersActive = hasActiveHistoriaFilters(filters)

  const handleChartPointHover = useCallback(
    (id) => {
      if (id == null) return
      setHighlightedRowId(id)
      const targetPage = pageIndexForHistoriaRow(filteredRows, id, pageSize)
      if (targetPage != null && targetPage !== page) {
        setPage(targetPage)
      }
    },
    [filteredRows, pageSize, page],
  )

  const handleChartPointLeave = useCallback(() => {
    setHighlightedRowId(null)
  }, [])

  useEffect(() => {
    if (highlightedRowId == null) return undefined
    const timer = window.setTimeout(() => {
      document
        .getElementById(`historia-row-${highlightedRowId}`)
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }, 120)
    return () => window.clearTimeout(timer)
  }, [highlightedRowId, page])

  useEffect(() => {
    if (hydrating) return
    if (!isAuthenticated || !token) {
      setLoading(false)
      setRows([])
      setChartPoints([])
      setPagina('dashboard')
      return
    }
    loadAll()
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
          onClick={() => {
            loadChartPoints()
            loadTable()
          }}
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

      {!loading && !error && totalElements === 0 && (
        <EmptyState
          mensaje={t('historiaConsumos.empty')}
          actionLabel={t('historiaConsumos.goToAnalysis', 'Ir a Análisis IA')}
          onAction={goToAnalisis}
        />
      )}

      {!loading && !error && totalElements > 0 && (
        <>
          <div className="row g-3 mb-3">
            <CardConsumo
              titulo={t('historiaConsumos.kpiCount', 'Consultas')}
              valor={String(kpis.count)}
            />
            <CardConsumo
              titulo={t('historiaConsumos.kpiAvgKwh', 'Promedio kWh')}
              valor={kpis.avgKwh != null ? `${kpis.avgKwh} kWh` : '—'}
            />
            <CardConsumo
              titulo={t('historiaConsumos.kpiAvgSavings', 'Ahorro promedio')}
              valor={kpis.avgAhorro != null ? `${kpis.avgAhorro}%` : '—'}
            />
          </div>

          {filtersActive && (
            <p className="text-muted small mb-3" role="note">
              {t('historiaConsumos.filtersHint').replace(
                '{count}',
                String(filteredRows.length),
              )}
            </p>
          )}

          <p className="text-muted small mb-3" role="note">
            {t('historiaConsumos.seriesHint')}
          </p>

          {filteredSeries.length === 0 ? (
            <div className="alert alert-secondary border-0 py-2 small mb-4" role="status">
              {t('historiaConsumos.filtersEmpty')}
            </div>
          ) : (
            <>
              <GraficoHistoriaConsumo
                points={filteredSeries.map((row) => ({
                  id: row.id,
                  createdAt: row.createdAt,
                  consumo: row.consumo ?? row.consumoKwh,
                }))}
                onPointHover={handleChartPointHover}
                onPointLeave={handleChartPointLeave}
                highlightedPointId={highlightedRowId}
              />
              <GraficosHistoriaExtra
                points={filteredSeries.map((row) => ({
                  id: row.id,
                  createdAt: row.createdAt,
                  ahorro: row.ahorro,
                  nivelKey: row.nivelKey,
                }))}
                onPointHover={handleChartPointHover}
                onPointLeave={handleChartPointLeave}
                highlightedPointId={highlightedRowId}
              />
            </>
          )}

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
                    {pagedRows.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-muted text-center py-4 small">
                          {t('historiaConsumos.filtersEmptyTable')}
                        </td>
                      </tr>
                    ) : (
                      pagedRows.map((row) => {
                        const consumo = consumoFromRow(row)
                        const consumoPrev = numericFromRow(row, 'consumoKwhMesAnterior')
                        const superficie = numericFromRow(row, 'areaM2')
                        return (
                          <tr
                            key={row.id}
                            id={`historia-row-${row.id}`}
                            className={
                              historiaRowIdsEqual(highlightedRowId, row.id)
                                ? 'historia-row-highlight'
                                : undefined
                            }
                          >
                            <td className="small text-nowrap">
                              {formatDate(row.createdAt, locale)}
                            </td>
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
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <TablePagination
                page={page}
                totalPages={filteredTotalPages}
                totalElements={filteredRows.length}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                t={t}
                idPrefix="historia-consumos"
              />
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
              <AnalysisTipsTable tipKeys={tips} t={t} />
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
