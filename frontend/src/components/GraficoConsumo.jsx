import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { useLocale } from '../context/LocaleContext'
import consumoData from '../data/consumo.json'

function GraficoConsumo({ consumos = consumoData }) {
  const { theme } = useTheme()
  const { t } = useLocale()
  const gridColor = theme === 'dark' ? '#444' : '#ccc'
  const textColor = theme === 'dark' ? '#ccc' : '#333'
  const lineColor = theme === 'dark' ? '#6ea8fe' : '#0d6efd'

  const datos = consumos.map((item) => ({
    mes: t(`months.${item.mes}`).slice(0, 3),
    consumo: item.consumo,
  }))

  // Escala Y automática: acerca el rango a los valores para que se vea mejor la curva.
  const yDomain = [
    (dataMin) => {
      const span = Math.max(dataMin * 0.15, 1)
      return Math.max(0, Math.floor(dataMin - span))
    },
    (dataMax) => {
      const span = Math.max(dataMax * 0.15, 1)
      return Math.ceil(dataMax + span)
    },
  ]

  return (
    <div className="card shadow mt-4">
      <div className="card-body">
        <h4>{t('chart.title')}</h4>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={datos}>
            <CartesianGrid stroke={gridColor} />
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
              domain={yDomain}
              allowDataOverflow={false}
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
            <Line
              type="monotone"
              dataKey="consumo"
              stroke={lineColor}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default GraficoConsumo
