import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useLocale } from '../context/LocaleContext'
import { buildPeakOffPeakSeries, resolveAnalyticsOverview } from '../utils/analyticsSeries'
import { formatConsumptionProfile } from '../utils/consumptionProfile'
import {
  chartTooltipProps,
  toggleSeriesVisibility,
} from '../utils/chartInteractivity'
import DemoSampleBadge from './DemoSampleBadge'
import ChartVisualShell from './ChartVisualShell'
import ChartSrTable from './ChartSrTable'

function GraficoPicoValle({ analytics, chartBadgeVariant = 'demo', syncId }) {
  const { theme } = useTheme()
  const { t, locale } = useLocale()
  const [hidden, setHidden] = useState({})
  const gridColor = theme === 'dark' ? '#444' : '#ccc'
  const textColor = theme === 'dark' ? '#ccc' : '#333'
  const peakColor = theme === 'dark' ? '#e35d6a' : '#dc3545'
  const offPeakColor = theme === 'dark' ? '#ffc107' : '#fd7e14'

  const overview = resolveAnalyticsOverview(analytics)
  const data = buildPeakOffPeakSeries(t, analytics, locale)
  const categoryLabel = formatConsumptionProfile(t, overview.category)
  const confidencePct = Math.round((overview.confidence ?? 0.87) * 100)
  const title = t('chart.peakVsOffPeak')
  const tableCaption = `${title}. ${t('a11y.chartDataCaption', 'Datos del gráfico en tabla')}.`

  if (!data.length) {
    return null
  }

  return (
    <div className="card shadow mt-4 mt-xl-0 w-100 h-100">
      <div className="card-body d-flex flex-column h-100">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-2 mb-1">
          <h3 id="chart-peak-title" className="mb-0 d-flex flex-wrap align-items-center gap-2">
            <span>{title}</span>
            <DemoSampleBadge variant={chartBadgeVariant} />
          </h3>
          <div className="d-flex flex-wrap gap-2">
            <span className="badge text-bg-primary">{categoryLabel}</span>
            <span className="badge text-bg-secondary">
              {t('chart.confidence')}: {confidencePct}%
            </span>
          </div>
        </div>
        <p className="text-muted small mb-3">{t('chart.peakVsOffPeakHint')}</p>

        <ChartVisualShell className="flex-grow-1" style={{ minHeight: 300 }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <BarChart data={data} syncId={syncId} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis
                dataKey="mes"
                stroke={textColor}
                tick={{ fill: textColor }}
                label={{
                  value: t('chart.axisMonth'),
                  position: 'insideBottom',
                  offset: -2,
                  fill: textColor,
                }}
              />
              <YAxis
                stroke={textColor}
                tick={{ fill: textColor }}
                label={{
                  value: t('chart.axisKwh'),
                  angle: -90,
                  position: 'insideLeft',
                  fill: textColor,
                }}
              />
              <Tooltip
                {...chartTooltipProps(theme, { locale })}
                labelFormatter={(_label, payload) =>
                  payload?.[0]?.payload?.mesFull ?? _label
                }
              />
              <Legend
                onClick={(entry) => toggleSeriesVisibility(entry.dataKey, setHidden)}
                wrapperStyle={{ cursor: 'pointer' }}
              />
              <Bar
                dataKey="peak"
                stackId="usage"
                name={t('chart.seriesPeak')}
                fill={peakColor}
                hide={Boolean(hidden.peak)}
              />
              <Bar
                dataKey="offPeak"
                stackId="usage"
                name={t('chart.seriesOffPeak')}
                fill={offPeakColor}
                radius={[4, 4, 0, 0]}
                hide={Boolean(hidden.offPeak)}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartVisualShell>

        <ChartSrTable
          tableId="chart-peak-data"
          caption={tableCaption}
          columns={[
            { key: 'mes', label: t('chart.axisMonth') },
            { key: 'peak', label: t('chart.seriesPeak') },
            { key: 'offPeak', label: t('chart.seriesOffPeak') },
          ]}
          rows={data.map((row) => ({ key: row.mes, ...row }))}
        />
      </div>
    </div>
  )
}

export default GraficoPicoValle
