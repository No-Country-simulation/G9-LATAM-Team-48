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
import { formatMonthLabel } from '../utils/monthLabels'
import { yDomainWithPadding } from '../utils/chartScale'
import { chartTooltipProps } from '../utils/chartInteractivity'
import ChartVisualShell from './ChartVisualShell'
import ChartSrTable from './ChartSrTable'
import DemoSampleBadge from './DemoSampleBadge'

function GraficoConsumo({ consumos = [], chartBadgeVariant = 'demo', syncId }) {
  const { theme } = useTheme()
  const { t, locale } = useLocale()
  const gridColor = theme === 'dark' ? '#444' : '#ccc'
  const textColor = theme === 'dark' ? '#ccc' : '#333'
  const lineColor = theme === 'dark' ? '#6ea8fe' : '#0d6efd'

  if (!consumos?.length) {
    return null
  }

  const datos = consumos.map((item) => ({
    mesKey: item.mes,
    mes: formatMonthLabel(t, item.mes, 'short', locale),
    mesFull: formatMonthLabel(t, item.mes, 'full', locale),
    consumo: Number(item.consumo),
  }))

  const yDomain = yDomainWithPadding(datos.map((item) => item.consumo))
  const tableCaption = `${t('chart.title')}. ${t('a11y.chartDataCaption', 'Datos del gráfico en tabla')}.`

  return (
    <div className="card shadow mt-4 chart-card">
      <div className="card-body">
        <h3 id="chart-consumo-title" className="d-flex flex-wrap align-items-center gap-2">
          <span>{t('chart.title')}</span>
          <DemoSampleBadge variant={chartBadgeVariant} />
        </h3>

        <ChartVisualShell className="chart-visual-shell--wide">
          <ResponsiveContainer width="100%" height={300}>
          <LineChart data={datos} syncId={syncId} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
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
              {...chartTooltipProps(theme, { locale })}
              labelFormatter={(_label, payload) =>
                payload?.[0]?.payload?.mesFull ?? _label
              }
            />
            <Line
              type="monotone"
              dataKey="consumo"
              name={t('chart.title')}
              stroke={lineColor}
              strokeWidth={2}
              dot={{ r: 4, fill: lineColor, strokeWidth: 0 }}
              activeDot={{ r: 6, stroke: lineColor, strokeWidth: 2 }}
              isAnimationActive
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
            key: row.mesKey,
            mes: row.mesFull,
            consumo: row.consumo,
          }))}
        />
      </div>
    </div>
  )
}

export default GraficoConsumo
