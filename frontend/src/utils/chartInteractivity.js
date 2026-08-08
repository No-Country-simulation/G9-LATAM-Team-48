/** syncId compartido: hover alineado entre gráficos del dashboard (Recharts). */
export const DASHBOARD_CHART_SYNC_ID = 'dashboard-charts'

export function formatKwhValue(value, locale = undefined) {
  const n = Number(value)
  if (Number.isNaN(n)) return '—'
  return `${n.toLocaleString(locale, { maximumFractionDigits: 1 })} kWh`
}

export function formatUsdValue(value, locale = undefined) {
  const n = Number(value)
  if (Number.isNaN(n)) return '—'
  return `$${n.toLocaleString(locale, { maximumFractionDigits: 0 })}`
}

/** Props comunes para <Tooltip /> (tema claro/oscuro + cursor). */
export function chartTooltipProps(theme, { locale, unit = 'kwh' } = {}) {
  const gridColor = theme === 'dark' ? '#444' : '#ccc'
  const textColor = theme === 'dark' ? '#ccc' : '#333'
  const formatValue =
    unit === 'usd'
      ? (v) => formatUsdValue(v, locale)
      : unit === 'pct'
        ? (v) => `${Number(v).toLocaleString(locale, { maximumFractionDigits: 1 })} %`
        : (v) => formatKwhValue(v, locale)
  return {
    contentStyle: {
      backgroundColor: theme === 'dark' ? '#212529' : '#fff',
      borderColor: gridColor,
      color: textColor,
    },
    cursor: { stroke: gridColor, strokeWidth: 1, strokeDasharray: '4 4' },
    formatter: (value, name) => [formatValue(value), name],
  }
}

/** Toggle de series al clic en la leyenda (Recharts). */
export function toggleSeriesVisibility(dataKey, setHidden) {
  setHidden((prev) => ({
    ...prev,
    [dataKey]: !prev[dataKey],
  }))
}
