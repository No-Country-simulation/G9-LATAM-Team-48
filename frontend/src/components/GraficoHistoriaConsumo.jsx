import { useEffect, useRef, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

/**
 * @param {Array<{ id?: number|string, createdAt?: unknown, consumo: number }>} points
 */
export function buildHistoriaChartData(points, locale) {
  return [...(points || [])]
    .filter((item) => item && Number.isFinite(Number(item.consumo)))
    .map((item, index) => {
      const consumo = Number(item.consumo)
      const fecha = toDate(item.createdAt) || new Date(index)
      return {
        id: item.id ?? index,
        fecha,
        label: `${formatShortDate(item.createdAt, locale)} · #${item.id ?? index + 1}`,
        consumo,
      }
    })
    .sort((a, b) => a.fecha - b.fecha)
}

function fillTemplate(template, values) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  )
}

function useElementWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const update = () => setWidth(Math.floor(el.getBoundingClientRect().width))
    update()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }

    const observer = new ResizeObserver(() => update())
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, width]
}

function GraficoHistoriaConsumo({ points = [] }) {
  const { theme } = useTheme()
  const { t, locale } = useLocale()
  const [wrapRef, width] = useElementWidth()
  const datos = buildHistoriaChartData(points, locale)

  if (!points.length && !datos.length) return null

  const gridColor = theme === 'dark' ? '#444' : '#ccc'
  const textColor = theme === 'dark' ? '#ccc' : '#333'
  const chartHeight = 280

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
  const yMax = Math.max(...datos.map((item) => item.consumo), 1) * 1.2

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

        <div ref={wrapRef} style={{ width: '100%', height: chartHeight }}>
          {width > 0 ? (
            <LineChart
              width={width}
              height={chartHeight}
              data={datos}
              margin={{ top: 12, right: 16, left: 8, bottom: 8 }}
            >
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
              />
              <Tooltip
                formatter={(value) => [
                  `${value} kWh`,
                  t('historiaConsumos.chartSeries', 'Consumo'),
                ]}
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#212529' : '#fff',
                  borderColor: gridColor,
                  color: textColor,
                }}
              />
              <ReferenceLine y={first} stroke={gridColor} strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="consumo"
                stroke={lineColor}
                strokeWidth={3}
                dot={{ r: 5, fill: lineColor, strokeWidth: 0 }}
                activeDot={{ r: 7 }}
                isAnimationActive={false}
              />
            </LineChart>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default GraficoHistoriaConsumo
