import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { useLocale } from '../context/LocaleContext'
import { formatMonthLabel } from '../utils/monthLabels'
import { chartTooltipProps, DASHBOARD_CHART_SYNC_ID } from '../utils/chartInteractivity'
import { buildVariationSeries } from '../utils/dashboardChartFilters'
import ChartVisualShell from './ChartVisualShell'
import ChartSrTable from './ChartSrTable'
import DemoSampleBadge from './DemoSampleBadge'

function GraficoVariacionMensual({
  consumos = [],
  valueKey = 'consumo',
  chartBadgeVariant = 'demo',
  syncId = DASHBOARD_CHART_SYNC_ID,
}) {
  const { theme } = useTheme()
  const { t, locale } = useLocale()
  const gridColor = theme === 'dark' ? '#444' : '#ccc'
  const textColor = theme === 'dark' ? '#ccc' : '#333'
  const positive = theme === 'dark' ? '#75b798' : '#198754'
  const negative = theme === 'dark' ? '#e35d6a' : '#dc3545'

  const rawVariation = buildVariationSeries(consumos, valueKey)
  const datos = rawVariation
    .filter((row) => row.variacionPct != null)
    .map((row) => ({
      ...row,
      mes: formatMonthLabel(t, row.mesKey, 'short', locale),
      mesFull: formatMonthLabel(t, row.mesKey, 'full', locale),
    }))

  if (datos.length === 0) {
    return null
  }

  const isCost = valueKey === 'costo'
  const title = isCost
    ? t('chart.variationCostTitle', 'Variación mensual del costo (%)')
    : t('chart.variationKwhTitle', 'Variación mensual del consumo (%)')
  const hint = isCost
    ? t('chart.variationCostHint', 'Cambio porcentual respecto al mes anterior (costo).')
    : t('chart.variationKwhHint', 'Cambio porcentual respecto al mes anterior (kWh).')
  const tableCaption = `${title}. ${t('a11y.chartDataCaption', 'Datos del gráfico en tabla')}.`

  return (
    <div className="card shadow mt-4 mt-xl-0 w-100 h-100">
      <div className="card-body d-flex flex-column h-100">
        <h3 id="chart-variation-title" className="mb-1 d-flex flex-wrap align-items-center gap-2">
          <span>{title}</span>
          <DemoSampleBadge variant={chartBadgeVariant} />
        </h3>
        <p className="text-muted small mb-3">{hint}</p>

        <ChartVisualShell className="flex-grow-1" style={{ minHeight: 280 }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={280}>
            <BarChart data={datos} syncId={syncId} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="mes" stroke={textColor} tick={{ fill: textColor }} />
              <YAxis
                stroke={textColor}
                tick={{ fill: textColor }}
                unit="%"
                label={{
                  value: '%',
                  angle: -90,
                  position: 'insideLeft',
                  fill: textColor,
                }}
              />
              <ReferenceLine y={0} stroke={gridColor} />
              <Tooltip
                {...chartTooltipProps(theme, { locale, unit: 'pct' })}
                labelFormatter={(_label, payload) =>
                  payload?.[0]?.payload?.mesFull ?? _label
                }
              />
              <Bar
                dataKey="variacionPct"
                name={t('chart.variationSeries', 'Variación')}
                radius={[4, 4, 0, 0]}
              >
                {datos.map((entry) => (
                  <Cell
                    key={entry.mesKey}
                    fill={(entry.variacionPct ?? 0) >= 0 ? negative : positive}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartVisualShell>

        <ChartSrTable
          tableId="chart-variation-data"
          caption={tableCaption}
          columns={[
            { key: 'mes', label: t('chart.axisMonth') },
            { key: 'variacionPct', label: t('chart.variationSeries', 'Variación') },
          ]}
          rows={datos.map((row) => ({
            key: row.mesKey,
            mes: row.mesFull,
            variacionPct: `${row.variacionPct} %`,
          }))}
        />
      </div>
    </div>
  )
}

export default GraficoVariacionMensual
