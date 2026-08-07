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
import { yDomainWithPadding } from '../utils/chartScale'
import ChartVisualShell from './ChartVisualShell'
import ChartSrTable from './ChartSrTable'
import DemoSampleBadge from './DemoSampleBadge'

function GraficoConsumo({ consumos = [], chartBadgeVariant = 'demo' }) {
  const { theme } = useTheme()
  const { t } = useLocale()
  const gridColor = theme === 'dark' ? '#444' : '#ccc'
  const textColor = theme === 'dark' ? '#ccc' : '#333'
  const lineColor = theme === 'dark' ? '#6ea8fe' : '#0d6efd'

  if (!consumos?.length) {
    return null
  }

  const datos = consumos.map((item) => ({
    mes: t(`months.${item.mes}`).slice(0, 3),
    consumo: Number(item.consumo),
  }))

  const yDomain = yDomainWithPadding(datos.map((item) => item.consumo))
  const tableCaption = `${t('chart.title')}. ${t('a11y.chartDataCaption', 'Datos del gráfico en tabla')}.`

  return (
    <div className="card shadow mt-4">
      <div className="card-body">
        <h3 id="chart-consumo-title" className="d-flex flex-wrap align-items-center gap-2">
          <span>{t('chart.title')}</span>
          <DemoSampleBadge variant={chartBadgeVariant} />
        </h3>

        <ChartVisualShell>
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
        </ChartVisualShell>

        <ChartSrTable
          tableId="chart-consumo-data"
          caption={tableCaption}
          columns={[
            { key: 'mes', label: t('chart.axisMonth') },
            { key: 'consumo', label: t('chart.axisKwh') },
          ]}
          rows={datos.map((row) => ({
            key: row.mes,
            mes: row.mes,
            consumo: row.consumo,
          }))}
        />
      </div>
    </div>
  )
}

export default GraficoConsumo
