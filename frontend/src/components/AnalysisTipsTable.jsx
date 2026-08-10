import { tipMetaFor } from '../utils/analysisTipsEngine'

function priorityLabel(t, priority) {
  const key = `analysis.tipsPriority.${priority}`
  const label = t(key)
  return label === key ? priority : label
}

function priorityClass(priority) {
  if (priority === 'high') return 'text-danger'
  if (priority === 'low') return 'text-success'
  return 'text-warning'
}

/**
 * Tabla de sugerencias según tipKeys del análisis (prioridad + foco + texto i18n).
 */
export default function AnalysisTipsTable({ tipKeys = [], t, className = '' }) {
  const keys = Array.isArray(tipKeys) ? tipKeys.filter(Boolean) : []
  if (keys.length === 0) {
    return (
      <p className="small text-muted mb-0">{t('analysis.noTips', 'Sin sugerencias para este análisis.')}</p>
    )
  }

  return (
    <div className={`table-responsive ${className}`.trim()}>
      <table className="table table-sm table-striped align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">{t('analysis.tipsTable.priority', 'Prioridad')}</th>
            <th scope="col">{t('analysis.tipsTable.suggestion', 'Sugerencia')}</th>
            <th scope="col" className="d-none d-md-table-cell">
              {t('analysis.tipsTable.focus', 'Enfoque')}
            </th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => {
            const meta = tipMetaFor(key)
            const listKey = `analysis.tipsList.${key}`
            let suggestion = t(listKey, '')
            if (!suggestion || suggestion === listKey) {
              const catalogKey = `recommendations.catalog.${key}.title`
              suggestion = t(catalogKey, key)
            }
            return (
              <tr key={key}>
                <td className={`small fw-semibold ${priorityClass(meta.priority)}`}>
                  {priorityLabel(t, meta.priority)}
                </td>
                <td className="small">{suggestion}</td>
                <td className="d-none d-md-table-cell small text-muted">
                  {t(meta.focusKey, meta.focusKey)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
