/** Fallback demo del backend: 6 meses con 320 kWh en enero. */
export function isBackendDemoConsumos(consumos) {
  return (
    consumos?.length === 6 &&
    consumos[0]?.consumo === 320 &&
    consumos[1]?.consumo === 340
  )
}

/**
 * Badge de gráficos: dataset DS agregado vs ejemplo demo.
 * Usa fromDataset del API y, si falta, heurística por historial de consumos.
 */
export function resolveChartBadgeVariant(analytics, consumos) {
  if (analytics?.fromDataset) {
    return 'dataset'
  }
  if (isBackendDemoConsumos(consumos)) {
    return 'demo'
  }
  if (consumos?.length >= 12 || analytics?.months?.length >= 12) {
    return 'dataset'
  }
  return 'demo'
}
