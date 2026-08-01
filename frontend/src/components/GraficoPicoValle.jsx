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
import { useTheme } from '../context/ThemeContext'
import { useLocale } from '../context/LocaleContext'
import { analyticsMock } from '../data/analyticsMock'
import DemoSampleBadge from './DemoSampleBadge'
import ChartSrTable from './ChartSrTable'

function buildSeries(t) {
  return analyticsMock.months.map((month, index) => ({
    mes: t(`months.${month}`).slice(0, 3),
    peak: analyticsMock.peakKwh[index],
    offPeak: analyticsMock.offPeakKwh[index],
  }))
}

function GraficoPicoValle() {
  const { theme } = useTheme()
  const { t } = useLocale()
  const gridColor = theme === 'dark' ? '#444' : '#ccc'
  const textColor = theme === 'dark' ? '#ccc' : '#333'
  const peakColor = theme === 'dark' ? '#e35d6a' : '#dc3545'
  const offPeakColor = theme === 'dark' ? '#ffc107' : '#fd7e14'

  const data = buildSeries(t)
  const categoryLabel = t(`chart.categories.${analyticsMock.category}`)
  const confidencePct = Math.round(analyticsMock.confidence * 100)
  const title = t('chart.peakVsOffPeak')
  const tableCaption = `${title}. ${t('a11y.chartDataCaption', 'Datos del gráfico en tabla')}.`

  return (
    <div className="card shadow mt-4 mt-xl-0 w-100 h-100">
      <div className="card-body d-flex flex-column h-100">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-2 mb-1">
          <h4 id="chart-peak-title" className="mb-0 d-flex flex-wrap align-items-center gap-2">
            <span>{title}</span>
            <DemoSampleBadge />
          </h4>
          <div className="d-flex flex-wrap gap-2">
            <span className="badge text-bg-primary">{categoryLabel}</span>
            <span className="badge text-bg-secondary">
              {t('chart.confidence')}: {confidencePct}%
            </span>
          </div>
        </div>
        <p className="text-muted small mb-3">{t('chart.peakVsOffPeakHint')}</p>

        <div className="flex-grow-1" style={{ minHeight: 300 }} aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <BarChart data={data}>
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
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#212529' : '#fff',
                  borderColor: gridColor,
                  color: textColor,
                }}
              />
              <Legend />
              <Bar
                dataKey="peak"
                stackId="usage"
                name={t('chart.seriesPeak')}
                fill={peakColor}
              />
              <Bar
                dataKey="offPeak"
                stackId="usage"
                name={t('chart.seriesOffPeak')}
                fill={offPeakColor}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

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
