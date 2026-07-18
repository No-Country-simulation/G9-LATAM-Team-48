import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { useLocale } from '../context/LocaleContext'
import { getBenchmark } from '../services/iaService'

function GraficoAnalisisIA({ tipo, consumo, datos = {} }) {
  const { theme } = useTheme()
  const { t } = useLocale()
  const gridColor = theme === 'dark' ? '#444' : '#ccc'
  const textColor = theme === 'dark' ? '#ccc' : '#333'
  const yoursColor = theme === 'dark' ? '#6ea8fe' : '#0d6efd'
  const refColor = theme === 'dark' ? '#adb5bd' : '#6c757d'

  const consumoNum = Number(consumo)
  const hasConsumo = Number.isFinite(consumoNum) && consumoNum > 0
  const benchmark = getBenchmark(tipo, { ...datos, tipo })

  const data = [
    {
      name: t('analysis.chart.seriesYours'),
      kwh: hasConsumo ? consumoNum : 0,
      fill: yoursColor,
    },
    {
      name: t('analysis.chart.seriesBenchmark'),
      kwh: benchmark,
      fill: refColor,
    },
  ]

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        <h5 className="mb-1">{t('analysis.chart.title')}</h5>
        <p className="text-muted small mb-3">{t('analysis.chart.hint')}</p>

        {!hasConsumo ? (
          <p className="text-muted small mb-0 flex-grow-1 d-flex align-items-center justify-content-center text-center px-3">
            {t('analysis.chart.empty')}
          </p>
        ) : (
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  stroke={textColor}
                  tick={{ fill: textColor, fontSize: 12 }}
                />
                <YAxis
                  stroke={textColor}
                  tick={{ fill: textColor, fontSize: 12 }}
                  label={{
                    value: t('chart.axisKwh'),
                    angle: -90,
                    position: 'insideLeft',
                    fill: textColor,
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#212529' : '#fff',
                    borderColor: gridColor,
                    color: textColor,
                  }}
                  formatter={(value) => [`${value} kWh`, '']}
                />
                <Bar dataKey="kwh" radius={[4, 4, 0, 0]}>
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default GraficoAnalisisIA
