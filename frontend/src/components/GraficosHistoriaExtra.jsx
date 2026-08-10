import { useEffect, useRef, useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { useLocale } from '../context/LocaleContext'
import { yDomainWithPadding } from '../utils/chartScale'
import {
  HistoriaChartDot,
  historiaChartHoverHandlers,
} from '../utils/historiaChartInteraction'

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

const LEVEL_ORDER = ['efficient', 'moderate', 'inefficient']

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

function useElementWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const update = () => {
      const measured = Math.floor(el.getBoundingClientRect().width || el.clientWidth || 0)
      setWidth(measured > 0 ? measured : 640)
    }
    update()
    const timer = window.setTimeout(update, 50)

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update)
      return () => {
        window.clearTimeout(timer)
        window.removeEventListener('resize', update)
      }
    }

    const observer = new ResizeObserver(() => update())
    observer.observe(el)
    return () => {
      window.clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return [ref, width]
}

function buildSavingsSeries(points, locale) {
  return [...(points || [])]
    .filter((item) => item && Number.isFinite(Number(item.ahorro)))
    .map((item, index) => {
      const ahorro = Number(item.ahorro)
      const fecha = toDate(item.createdAt) || new Date(index)
      return {
        id: item.id,
        fecha,
        label: formatShortDate(item.createdAt, locale),
        ahorro,
      }
    })
    .sort((a, b) => a.fecha - b.fecha)
}

function buildLevelCounts(points, t) {
  const counts = {
    efficient: 0,
    moderate: 0,
    inefficient: 0,
  }
  for (const item of points || []) {
    const key = String(item?.nivelKey || '').toLowerCase()
    if (Object.prototype.hasOwnProperty.call(counts, key)) {
      counts[key] += 1
    }
  }
  return LEVEL_ORDER.map((key) => ({
    key,
    name: t(`analysis.levels.${key}`, key),
    count: counts[key],
  }))
}

function levelColor(key, theme) {
  const dark = theme === 'dark'
  if (key === 'efficient') return dark ? '#75b798' : '#198754'
  if (key === 'inefficient') return dark ? '#ea868f' : '#dc3545'
  return dark ? '#ffda6a' : '#ffc107'
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h2 className="h6 mb-1">{title}</h2>
        {subtitle ? <p className="text-muted small mb-3">{subtitle}</p> : null}
        {children}
      </div>
    </div>
  )
}

function SavingsChart({
  points,
  onPointHover,
  onPointLeave,
  highlightedPointId = null,
}) {
  const { theme } = useTheme()
  const { t, locale } = useLocale()
  const [wrapRef, width] = useElementWidth()
  const datos = buildSavingsSeries(points, locale)
  const chartHeight = 240
  const gridColor = theme === 'dark' ? '#444' : '#ccc'
  const textColor = theme === 'dark' ? '#ccc' : '#333'
  const lineColor = theme === 'dark' ? '#6ea8fe' : '#0d6efd'

  if (datos.length < 2) {
    return (
      <ChartCard
        title={t('historiaConsumos.savingsChartTitle', 'Evolución del ahorro')}
        subtitle={t(
          'historiaConsumos.chartNeedData',
          'Para ver el gráfico hacen falta al menos 2 consultas con consumo guardado.',
        )}
      />
    )
  }

  const first = datos[0].ahorro
  const yDomain = yDomainWithPadding(datos.map((item) => item.ahorro))
  const hoverHandlers = historiaChartHoverHandlers(datos, onPointHover, onPointLeave)

  return (
    <ChartCard
      title={t('historiaConsumos.savingsChartTitle', 'Evolución del ahorro')}
      subtitle={t(
        'historiaConsumos.savingsChartSubtitle',
        'Potencial de ahorro estimado en cada consulta.',
      )}
    >
      <div
        ref={wrapRef}
        className="chart-visual-shell"
        style={{ width: '100%', height: chartHeight, minHeight: chartHeight }}
      >
        <LineChart
          width={Math.max(width, 280)}
          height={chartHeight}
          data={datos}
          margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
          {...hoverHandlers}
        >
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            stroke={textColor}
            tick={{ fill: textColor, fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke={textColor}
            tick={{ fill: textColor, fontSize: 11 }}
            domain={yDomain}
            allowDataOverflow={false}
            width={48}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            formatter={(value) => [
              `${value}%`,
              t('historiaConsumos.savingsSeries', 'Ahorro'),
            ]}
            cursor={{ stroke: lineColor, strokeWidth: 1, strokeDasharray: '4 4' }}
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#212529' : '#fff',
              borderColor: gridColor,
              color: textColor,
            }}
          />
          <ReferenceLine y={first} stroke={gridColor} strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="ahorro"
            stroke={lineColor}
            strokeWidth={3}
            dot={(props) => (
              <HistoriaChartDot
                {...props}
                fill={lineColor}
                highlightedPointId={highlightedPointId}
                onPointHover={onPointHover}
                activeStroke={textColor}
                baseRadius={4}
                activeRadius={7}
              />
            )}
            activeDot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </div>
    </ChartCard>
  )
}

function LevelChart({ points }) {
  const { theme } = useTheme()
  const { t } = useLocale()
  const [wrapRef, width] = useElementWidth()
  const datos = buildLevelCounts(points, t)
  const total = datos.reduce((sum, item) => sum + item.count, 0)
  const chartHeight = 240
  const gridColor = theme === 'dark' ? '#444' : '#ccc'
  const textColor = theme === 'dark' ? '#ccc' : '#333'

  if (total < 1) return null

  const yMax = Math.max(...datos.map((item) => item.count), 1) + 1

  return (
    <ChartCard
      title={t('historiaConsumos.levelChartTitle', 'Distribución por nivel')}
      subtitle={t(
        'historiaConsumos.levelChartSubtitle',
        'Cuántas consultas cayeron en cada nivel de eficiencia.',
      )}
    >
      <div
        ref={wrapRef}
        className="chart-visual-shell"
        style={{ width: '100%', height: chartHeight, minHeight: chartHeight }}
      >
        <BarChart
          width={Math.max(width, 280)}
          height={chartHeight}
          data={datos}
          margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
        >
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            stroke={textColor}
            tick={{ fill: textColor, fontSize: 11 }}
          />
          <YAxis
            stroke={textColor}
            tick={{ fill: textColor, fontSize: 11 }}
            allowDecimals={false}
            domain={[0, yMax]}
            width={36}
          />
          <Tooltip
            formatter={(value) => [
              value,
              t('historiaConsumos.levelCount', 'Consultas'),
            ]}
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#212529' : '#fff',
              borderColor: gridColor,
              color: textColor,
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive={false}>
            {datos.map((entry) => (
              <Cell key={entry.key} fill={levelColor(entry.key, theme)} />
            ))}
          </Bar>
        </BarChart>
      </div>
    </ChartCard>
  )
}

function GraficosHistoriaExtra({
  points = [],
  onPointHover,
  onPointLeave,
  highlightedPointId = null,
}) {
  if (!points.length) return null

  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-lg-6">
        <SavingsChart
          points={points}
          onPointHover={onPointHover}
          onPointLeave={onPointLeave}
          highlightedPointId={highlightedPointId}
        />
      </div>
      <div className="col-12 col-lg-6">
        <LevelChart points={points} />
      </div>
    </div>
  )
}

export default GraficosHistoriaExtra
