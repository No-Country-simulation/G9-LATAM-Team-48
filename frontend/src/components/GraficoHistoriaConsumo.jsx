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

const CONSUMO_ALIASES = [
  'consumoKwh',
  'consumo_kwh',
  'consumo',
]

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

function formatShortDate(value, locale) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleDateString(LOCALE_TAGS[locale] || locale || undefined, {
      day: '2-digit',
      month: 'short',
    })
  } catch {
    return String(value)
  }
}

function buildSeries(rows, locale) {
  return [...(rows || [])]
    .map((row) => {
      const request = normalizeRequestJson(row?.requestJson ?? row?.request_json)
      const consumo = pickConsumo(request)
      if (consumo == null) return null
      return {
        id: row.id,
        fecha: row.createdAt,
        label: formatShortDate(row.createdAt, locale),
        consumo,
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
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

  if (datos.length < 2) return null

  const first = datos[0].consumo
  const last = datos[datos.length - 1].consumo
  const delta = last - first
  const pct = first === 0 ? 0 : Math.round((delta / first) * 100)
  const absDelta = Math.abs(Math.round(delta * 10) / 10)
  const absPct = Math.abs(pct)

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

  const gridColor = theme === 'dark' ? '#444' : '#ccc'
  const textColor = theme === 'dark' ? '#ccc' : '#333'

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

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={datos} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 12 }}
            />
            <YAxis
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 12 }}
              unit=" kWh"
              width={56}
            />
            <Tooltip
              formatter={(value) => [`${value} kWh`, t('historiaConsumos.chartSeries', 'Consumo')]}
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
              label={{
                value: t('historiaConsumos.chartBaseline', 'Primera'),
                fill: textColor,
                fontSize: 11,
                position: 'insideTopRight',
              }}
            />
            <Line
              type="monotone"
              dataKey="consumo"
              name={t('historiaConsumos.chartSeries', 'Consumo')}
              stroke={lineColor}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default GraficoHistoriaConsumo
