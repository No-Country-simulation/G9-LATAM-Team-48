/** Variante de badge: datos agregados del backend vs serie demo local. */
export function resolveChartBadgeVariant(analytics, _consumos, options = {}) {
  if (analytics?.fromDataset || options.consumosFromDataset) {
    return 'dataset'
  }
  return 'demo'
}
