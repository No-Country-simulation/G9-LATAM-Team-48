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
import { chartTooltipProps, DASHBOARD_CHART_SYNC_ID } from '../utils/chartInteractivity'
import ChartVisualShell from './ChartVisualShell'
import ChartSrTable from './ChartSrTable'
import DemoSampleBadge from './DemoSampleBadge'

const SEGMENT_COLORS = {
  dark: ['#6ea8fe', '#75b798', '#ffda6a'],
  light: ['#0d6efd', '#198754', '#ffc107'],
}

function segmentLabel(t, segment) {
  const map = {
    Apartamento: t('analysis.types.APARTAMENTO', 'Apartamento'),
    'Casa Unifamiliar': t('analysis.types.CASA_UNIFAMILIAR', 'Casa unifamiliar'),
    'Pequeño Establecimiento Comercial': t(
      'analysis.types.PEQUENO_ESTABLECIMIENTO_COMERCIAL',
      'Pequeño establecimiento comercial',
    ),
  }
  return map[segment] ?? segment
}

function GraficoBreakdownTipoInmueble({
  breakdown,
  chartBadgeVariant = 'demo',
  syncId = DASHBOARD_CHART_SYNC_ID,
}) {
  const { theme } = useTheme()
  const { t, locale } = useLocale()
  const gridColor = theme === 'dark' ? '#444' : '#ccc'
  const textColor = theme === 'dark' ? '#ccc' : '#333'
  const palette = theme === 'dark' ? SEGMENT_COLORS.dark : SEGMENT_COLORS.light

  const items = breakdown?.items ?? []
  if (!items.length) {
    return null
  }

  const fromDataset = Boolean(breakdown?.fromDataset)
  const badge = fromDataset ? 'dataset' : chartBadgeVariant
  const datos = items.map((item, index) => ({
    key: item.segment,
    segment: segmentLabel(t, item.segment),
    avgKwh: Number(item.avgKwh),
    samples: Number(item.sampleCount ?? 0),
    fill: palette[index % palette.length],
  }))

  const title = t('chart.breakdownTipoTitle')
  const hint = t('chart.breakdownTipoHint')
  const tableCaption = `${title}. ${t('a11y.chartDataCaption', 'Datos del gráfico en tabla')}.`

  return (
    <div className="card shadow mt-4 w-100 chart-card">
      <div className="card-body">
        <h3 className="d-flex flex-wrap align-items-center gap-2">
          <span>{title}</span>
          <DemoSampleBadge variant={badge} />
        </h3>
        <p className="text-muted small mb-3">{hint}</p>

        <ChartVisualShell style={{ minHeight: 280 }}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={datos}
              layout="vertical"
              syncId={syncId}
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis type="number" stroke={textColor} tick={{ fill: textColor }} />
              <YAxis
                type="category"
                dataKey="segment"
                width={120}
                stroke={textColor}
                tick={{ fill: textColor, fontSize: 11 }}
              />
              <Tooltip {...chartTooltipProps(theme, { locale })} />
              <Bar dataKey="avgKwh" name={t('chart.axisKwh')} radius={[0, 4, 4, 0]}>
                {datos.map((entry) => (
                  <Cell key={entry.key} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartVisualShell>

        <ChartSrTable
          tableId="chart-breakdown-tipo"
          caption={tableCaption}
          columns={[
            { key: 'segment', label: t('analysis.installationType', 'Tipo de instalación') },
            { key: 'avgKwh', label: t('chart.axisKwh') },
            { key: 'samples', label: t('chart.breakdownSamples') },
          ]}
          rows={datos.map((row) => ({
            key: row.key,
            segment: row.segment,
            avgKwh: row.avgKwh,
            samples: row.samples,
          }))}
        />
      </div>
    </div>
  )
}

export default GraficoBreakdownTipoInmueble
