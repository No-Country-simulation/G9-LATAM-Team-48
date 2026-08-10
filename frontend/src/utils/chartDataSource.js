/** Badge de gráficos: dataset DS agregado vs sin datos reales en API. */
export function resolveChartBadgeVariant(analytics, _consumos, options = {}) {
  if (analytics?.fromDataset || options.consumosFromDataset) {
    return 'dataset'
  }
  return 'demo'
}
