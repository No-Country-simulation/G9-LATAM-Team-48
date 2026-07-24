import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { useLocale } from '../context/LocaleContext'

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

const CONSUMO_ALIASES = ['consumoKwh', 'consumo_kwh', 'consumo']

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

function pickConsumo(request) {
  for (const key of CONSUMO_ALIASES) {
    if (!Object.prototype.hasOwnProperty.call(request, key)) continue
    const num = Number(request[key])
    if (Number.isFinite(num)) return num
  }
  for (const [key, value] of Object.entries(request)) {
    const normalized = String(key).toLowerCase().replace(/_/g, '')
    if (normalized === 'consumokwh' || normalized === 'consumo') {
      const num = Number(value)
      if (Number.isFinite(num)) return num
    }
  }
  return null
}

function toDate(value) {
  if (value == null || value === '') return null
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }
  if (Array.isArray(value) && value.length >= 3) {
    const [y, m, d, h = 0, min = 0, s = 0] = value.map(Number)
    const date = new Date(y, m - 1, d, h, min, s)
    return Number.isNaN(date.getTime()) ? null : date
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatShortDate(value, locale) {
  const date = toDate(value)
  if (!date) return '—'
  try {
    return date.toLocaleDateString(LOCALE_TAGS[locale] || locale || undefined, {
      day: '2-digit',
      month: 'short',
    })
  } catch {
    return date.toISOString().slice(0, 10)
  }
}

function buildSeries(rows, locale) {
  return [...(rows || [])]
    .map((row, index) => {
      const request = normalizeRequestJson(row?.requestJson ?? row?.request_json)
      const consumo = pickConsumo(request)
      if (consumo == null) return null
      const fecha = toDate(row.createdAt) || new Date(0)
      const baseLabel = formatShortDate(row.createdAt, locale)
      return {
        id: row.id ?? index,
        fecha,
        label: `${baseLabel} · #${row.id ?? index + 1}`,
        consumo: Number(consumo),
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.fecha - b.fecha)
}

function fillTemplate(template, values) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  )
}

function GraficoHistoriaConsumo({ rows = [] }) {
  const { theme } = useTheme()
  const { t, locale } = useLocale()
  const datos = buildSeries(rows, locale)
  const totalRows = Array.isArray(rows) ? rows.length : 0

  if (totalRows < 2) return null

  const gridColor = theme === 'dark' ? '#444' : '#ccc'
  const textColor = theme === 'dark' ? '#ccc' : '#333'

  if (datos.length < 2) {
    return (
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5 mb-1">
            {t('historiaConsumos.chartTitle', 'Evolución del consumo')}
          </h2>
          <p className="text-muted small mb-0">
            {t(
              'historiaConsumos.chartNeedData',
              'Para ver el gráfico hacen falta al menos 2 consultas con consumo guardado.',
            )}
          </p>
        </div>
      </div>
    )
  }

  const first = datos[0].consumo
  const last = datos[datos.length - 1].consumo
  const delta = last - first
  const pct = first === 0 ? 0 : Math.round((delta / first) * 100)
  const absDelta = Math.abs(Math.round(delta * 10) / 10)
  const absPct = Math.abs(pct)
  const yMax = Math.max(...datos.map((item) => item.consumo), first) * 1.15 || 10

  let trendText
  let trendClass = 'text-muted'
  let lineColor = theme === 'dark' ? '#6ea8fe' : '#0d6efd'

  if (delta < 0) {
    trendText = fillTemplate(
      t(
        'historiaConsumos.trendDown',
        'Bajaste {delta} kWh ({pct}%) respecto de tu primera consulta.',
      ),
      { delta: absDelta, pct: absPct },
    )
    trendClass = 'text-success'
    lineColor = theme === 'dark' ? '#75b798' : '#198754'
  } else if (delta > 0) {
    trendText = fillTemplate(
      t(
        'historiaConsumos.trendUp',
        'Subiste {delta} kWh ({pct}%) respecto de tu primera consulta.',
      ),
      { delta: absDelta, pct: absPct },
    )
    trendClass = 'text-danger'
    lineColor = theme === 'dark' ? '#ea868f' : '#dc3545'
  } else {
    trendText = t(
      'historiaConsumos.trendFlat',
      'Tu consumo se mantiene igual que en la primera consulta.',
    )
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="h5 mb-1">
          {t('historiaConsumos.chartTitle', 'Evolución del consumo')}
        </h2>
        <p className="text-muted small mb-2">
          {t(
            'historiaConsumos.chartSubtitle',
            'Comparación entre tus consultas de Análisis IA.',
          )}
        </p>
        <p className={`small mb-3 ${trendClass}`}>{trendText}</p>

        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datos} margin={{ top: 12, right: 16, left: 8, bottom: 8 }}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                stroke={textColor}
                tick={{ fill: textColor, fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke={textColor}
                tick={{ fill: textColor, fontSize: 12 }}
                domain={[0, Math.ceil(yMax)]}
                width={64}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                formatter={(value) => [
                  `${value} kWh`,
                  t('historiaConsumos.chartSeries', 'Consumo'),
                ]}
                labelFormatter={(label) => label}
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#212529' : '#fff',
                  borderColor: gridColor,
                  color: textColor,
                }}
              />
              <ReferenceLine
                y={first}
                stroke={gridColor}
                strokeDasharray="4 4"
              />
              <Line
                type="monotone"
                dataKey="consumo"
                name={t('historiaConsumos.chartSeries', 'Consumo')}
                stroke={lineColor}
                strokeWidth={2}
                dot={{ r: 5, strokeWidth: 2, fill: lineColor }}
                activeDot={{ r: 7 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default GraficoHistoriaConsumo
