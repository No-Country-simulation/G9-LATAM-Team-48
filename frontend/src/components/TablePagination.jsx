import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { PAGE_SIZE_OPTIONS } from '../utils/pageResponse'

function formatPaginationSummary(t, current, totalPages, total) {
  const pattern = t('pagination.summary', 'Página {current} de {totalPages} ({total} registros)')
  return pattern
    .replace('{current}', String(current))
    .replace('{totalPages}', String(totalPages))
    .replace('{total}', String(total))
}

/**
 * Controles de paginación para tablas admin.
 */
export default function TablePagination({
  page,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
  t,
  idPrefix = 'table-page',
}) {
  const current = page + 1
  const pages = Math.max(totalPages, 1)
  const hasPrev = page > 0
  const hasNext = totalPages > 0 && page < totalPages - 1

  if (totalElements === 0) {
    return null
  }

  const summary = formatPaginationSummary(t, current, pages, totalElements)

  return (
    <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-2 p-3 border-top">
      <div className="small text-muted">{summary}</div>
      <div className="d-flex flex-wrap align-items-center gap-2">
        {onPageSizeChange && (
          <label className="d-flex align-items-center gap-1 small mb-0">
            <span className="text-muted">{t('pagination.pageSize')}</span>
            <select
              id={`${idPrefix}-size`}
              className="form-select form-select-sm"
              style={{ width: '4.5rem' }}
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label={t('pagination.pageSize')}
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="btn-group btn-group-sm" role="group" aria-label={t('pagination.nav')}>
          <button
            type="button"
            className="btn btn-outline-secondary d-inline-flex align-items-center"
            disabled={!hasPrev}
            onClick={() => onPageChange(page - 1)}
            aria-label={t('pagination.prev')}
          >
            <LuChevronLeft size={16} aria-hidden="true" />
            <span className="d-none d-md-inline ms-1">{t('pagination.prev')}</span>
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary d-inline-flex align-items-center"
            disabled={!hasNext}
            onClick={() => onPageChange(page + 1)}
            aria-label={t('pagination.next')}
          >
            <span className="d-none d-md-inline me-1">{t('pagination.next')}</span>
            <LuChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
