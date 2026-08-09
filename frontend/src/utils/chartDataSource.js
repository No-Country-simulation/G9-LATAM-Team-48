/** Fallback demo del backend: 12 meses benchmark (~9025 kWh/año). */
export function isBackendDemoConsumos(consumos) {
  if (consumos?.length !== 12) return false
  const total = consumos.reduce((sum, item) => sum + Number(item.consumo ?? 0), 0)
  return total >= 8900 && total <= 9150
}

/**
 * Badge de gráficos: dataset DS agregado vs ejemplo demo.
 */
export function resolveChartBadgeVariant(analytics, consumos, options = {}) {
  if (analytics?.fromDataset || options.consumosFromDataset) {
    return 'dataset'
  }
  if (isBackendDemoConsumos(consumos)) {
    return 'demo'
  }
  return 'demo'
}
