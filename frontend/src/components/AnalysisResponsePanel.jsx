import AnalysisTipsTable from './AnalysisTipsTable'

function firstDefined(...values) {
  for (const v of values) {
    if (v !== undefined && v !== null && v !== '') return v
  }
  return null
}

function formatConfidence(value) {
  const num = Number(value)
  if (!Number.isFinite(num)) return '—'
  const pct = num <= 1 ? Math.round(num * 100) : Math.round(num)
  return `${pct}%`
}

function formatBenchmark(value) {
  const num = Number(value)
  if (!Number.isFinite(num)) return '—'
  return `${Math.round(num)} kWh`
}

function formatAhorro(value) {
  if (value == null || value === '') return '—'
  const num = Number(value)
  return Number.isFinite(num) ? `${num}%` : String(value)
}

function labelNivel(t, nivel) {
  if (!nivel) return '—'
  const key = `analysis.levels.${nivel}`
  const translated = t(key)
  return translated === key ? String(nivel) : translated
}

function tipKeysFrom(response, row) {
  const fromResponse = response?.tipKeys
  if (Array.isArray(fromResponse) && fromResponse.length) return fromResponse
  if (Array.isArray(row?.tipKeys) && row.tipKeys.length) return row.tipKeys
  return []
}

/**
 * Resultado del análisis IA en formato legible (admin / detalle).
 */
export default function AnalysisResponsePanel({ response = {}, row = {}, t }) {
  const data = response && typeof response === 'object' ? response : {}
  const nivelKey = firstDefined(data.nivelKey, data.category, row.nivelKey)
  const ahorro = firstDefined(data.ahorro, row.ahorro)
  const confidence = firstDefined(data.confidence, row.confidence)
  const benchmark = firstDefined(data.benchmark, row.benchmark)
  const userId = firstDefined(data.userId, row.userId)
  const tips = tipKeysFrom(data, row)

  return (
    <div className="d-grid gap-3">
      <div className="table-responsive">
        <table className="table table-sm table-striped align-middle mb-0">
          <tbody>
            <tr>
              <th scope="row" className="text-nowrap w-25">
                {t('adminAnalisis.nivel')}
              </th>
              <td>{labelNivel(t, nivelKey)}</td>
            </tr>
            <tr>
              <th scope="row">{t('adminAnalisis.ahorro')}</th>
              <td>{formatAhorro(ahorro)}</td>
            </tr>
            <tr>
              <th scope="row">{t('adminAnalisis.confidence')}</th>
              <td>{formatConfidence(confidence)}</td>
            </tr>
            <tr>
              <th scope="row">
                {t('adminAnalisis.responseBenchmark', 'Consumo de referencia')}
              </th>
              <td>{formatBenchmark(benchmark)}</td>
            </tr>
            {userId != null && (
              <tr>
                <th scope="row">{t('adminAnalisis.responseUserId', 'ID usuario ML')}</th>
                <td className="small font-monospace">{String(userId)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <div className="fw-semibold mb-2">
          {t('historiaConsumos.recommendations', 'Recomendaciones')}
        </div>
        <AnalysisTipsTable tipKeys={tips} t={t} />
      </div>
    </div>
  )
}
