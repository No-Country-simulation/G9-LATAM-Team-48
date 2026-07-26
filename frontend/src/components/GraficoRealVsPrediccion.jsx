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

function buildSeries(t) {
  return analyticsMock.months.map((month, index) => ({
    mes: t(`months.${month}`).slice(0, 3),
    actual: analyticsMock.actualKwh[index],
    predicted: analyticsMock.predictedKwh[index],
  }))
}

function GraficoRealVsPrediccion() {
  const { theme } = useTheme()
  const { t } = useLocale()
  const gridColor = theme === 'dark' ? '#444' : '#ccc'
  const textColor = theme === 'dark' ? '#ccc' : '#333'
  const actualColor = theme === 'dark' ? '#6ea8fe' : '#0d6efd'
  const predictedColor = theme === 'dark' ? '#75b798' : '#198754'

  const data = buildSeries(t)

  return (
    <div className="card shadow mt-4 mt-xl-0 w-100 h-100">
      <div className="card-body d-flex flex-column h-100">
        <h4 className="mb-1 d-flex flex-wrap align-items-center gap-2">
          <span>{t('chart.actualVsPredicted')}</span>
          <DemoSampleBadge />
        </h4>
        <p className="text-muted small mb-3">{t('chart.actualVsPredictedHint')}</p>

        <div className="flex-grow-1" style={{ minHeight: 300 }}>
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
                dataKey="actual"
                name={t('chart.seriesActual')}
                fill={actualColor}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="predicted"
                name={t('chart.seriesPredicted')}
                fill={predictedColor}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default GraficoRealVsPrediccion
