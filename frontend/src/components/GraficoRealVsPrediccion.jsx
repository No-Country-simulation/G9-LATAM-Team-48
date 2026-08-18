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
import { buildActualVsPredictedSeries } from '../utils/analyticsSeries'
import {
  chartTooltipProps,
  DASHBOARD_CHART_SYNC_METHOD,
  toggleSeriesVisibility,
} from '../utils/chartInteractivity'
import DemoSampleBadge from './DemoSampleBadge'
import ChartVisualShell from './ChartVisualShell'
import ChartSrTable from './ChartSrTable'

function GraficoRealVsPrediccion({ analytics, chartBadgeVariant = 'demo', syncId }) {
  const { theme } = useTheme()
  const { t, locale } = useLocale()
  const [hidden, setHidden] = useState({})
  const gridColor = theme === 'dark' ? '#444' : '#ccc'
  const textColor = theme === 'dark' ? '#ccc' : '#333'
  const actualColor = theme === 'dark' ? '#6ea8fe' : '#0d6efd'
  const predictedColor = theme === 'dark' ? '#75b798' : '#198754'

  const data = buildActualVsPredictedSeries(t, analytics, locale)
  const title = t('chart.actualVsPredicted')
  const tableCaption = `${title}. ${t('a11y.chartDataCaption', 'Datos del gráfico en tabla')}.`

  if (!data.length) {
    return null
  }

  return (
    <div className="card shadow mt-4 mt-xl-0 w-100 h-100">
      <div className="card-body d-flex flex-column h-100">
        <h3 id="chart-predict-title" className="mb-1 d-flex flex-wrap align-items-center gap-2">
          <span>{title}</span>
          <DemoSampleBadge variant={chartBadgeVariant} />
        </h3>
        <p className="text-muted small mb-3">{t('chart.actualVsPredictedHint')}</p>

        <ChartVisualShell className="flex-grow-1" style={{ minHeight: 300 }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <BarChart
              data={data}
              syncId={syncId}
              syncMethod={DASHBOARD_CHART_SYNC_METHOD}
              margin={{ top: 8, right: 12, left: 4, bottom: 4 }}
            >
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
                dataKey="actual"
                name={t('chart.seriesActual')}
                fill={actualColor}
                radius={[4, 4, 0, 0]}
                hide={Boolean(hidden.actual)}
              />
              <Bar
                dataKey="predicted"
                name={t('chart.seriesPredicted')}
                fill={predictedColor}
                radius={[4, 4, 0, 0]}
                hide={Boolean(hidden.predicted)}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartVisualShell>

        <ChartSrTable
          tableId="chart-predict-data"
          caption={tableCaption}
          columns={[
            { key: 'mes', label: t('chart.axisMonth') },
            { key: 'actual', label: t('chart.seriesActual') },
            { key: 'predicted', label: t('chart.seriesPredicted') },
          ]}
          rows={data.map((row) => ({ key: row.mes, ...row }))}
        />
      </div>
    </div>
  )
}

export default GraficoRealVsPrediccion
