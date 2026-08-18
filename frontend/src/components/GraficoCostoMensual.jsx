import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { useLocale } from '../context/LocaleContext'
import { yDomainWithPadding } from '../utils/chartScale'
import {
  chartTooltipProps,
  DASHBOARD_CHART_SYNC_ID,
  DASHBOARD_CHART_SYNC_METHOD,
} from '../utils/chartInteractivity'
import { mapConsumosChartRows } from '../utils/dashboardChartFilters'
import ChartVisualShell from './ChartVisualShell'
import ChartSrTable from './ChartSrTable'
import DemoSampleBadge from './DemoSampleBadge'

function GraficoCostoMensual({
  consumos = [],
  chartBadgeVariant = 'demo',
  syncId = DASHBOARD_CHART_SYNC_ID,
}) {
  const { theme } = useTheme()
  const { t, locale } = useLocale()
  const gridColor = theme === 'dark' ? '#444' : '#ccc'
  const textColor = theme === 'dark' ? '#ccc' : '#333'
  const fillColor = theme === 'dark' ? '#75b798' : '#198754'

  if (!consumos?.length) {
    return null
  }

  const datos = mapConsumosChartRows(consumos, t, locale)
  const yDomain = yDomainWithPadding(datos.map((item) => item.costo))
  const title = t('chart.costTitle')
  const tableCaption = `${title}. ${t('a11y.chartDataCaption', 'Datos del gráfico en tabla')}.`

  return (
    <div className="card shadow mt-4 mt-xl-0 w-100 h-100">
      <div className="card-body d-flex flex-column h-100">
        <h3 id="chart-cost-title" className="mb-1 d-flex flex-wrap align-items-center gap-2">
          <span>{title}</span>
          <DemoSampleBadge variant={chartBadgeVariant} />
        </h3>
        <p className="text-muted small mb-3">
          {t('chart.costHint')}
        </p>

        <ChartVisualShell className="flex-grow-1" style={{ minHeight: 280 }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={280}>
            <AreaChart
              data={datos}
              syncId={syncId}
              syncMethod={DASHBOARD_CHART_SYNC_METHOD}
              margin={{ top: 8, right: 12, left: 4, bottom: 4 }}
            >
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="mes" stroke={textColor} tick={{ fill: textColor }} />
              <YAxis
                stroke={textColor}
                tick={{ fill: textColor }}
                domain={yDomain}
                allowDataOverflow={false}
              />
              <Tooltip
                {...chartTooltipProps(theme, { locale, unit: 'usd' })}
                labelFormatter={(_label, payload) =>
                  payload?.[0]?.payload?.mesFull ?? _label
                }
              />
              <Area
                type="monotone"
                dataKey="costo"
                name={t('consumos.estimatedCost', 'Costo estimado')}
                stroke={fillColor}
                fill={fillColor}
                fillOpacity={0.25}
                strokeWidth={2}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartVisualShell>

        <ChartSrTable
          tableId="chart-cost-data"
          caption={tableCaption}
          columns={[
            { key: 'mes', label: t('chart.axisMonth') },
            { key: 'costo', label: t('consumos.estimatedCost', 'Costo estimado') },
          ]}
          rows={datos.map((row) => ({
            key: row.mesKey,
            mes: row.mesFull,
            costo: row.costo,
          }))}
        />
      </div>
    </div>
  )
}

export default GraficoCostoMensual
