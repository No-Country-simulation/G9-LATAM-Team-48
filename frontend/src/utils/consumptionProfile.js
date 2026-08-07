/** API analytics category → claves de analysis.levels (Eficiente / Moderado / Ineficiente). */
export function categoryToProfileKey(category) {
  if (category === 'LOW_CONSUMPTION') return 'efficient'
  if (category === 'HIGH_CONSUMPTION') return 'inefficient'
  return 'moderate'
}

export function formatConsumptionProfile(t, category) {
  const key = categoryToProfileKey(category)
  const label = t(`analysis.levels.${key}`)
  if (label !== `analysis.levels.${key}`) return label
  const fallback = { efficient: 'Eficiente', moderate: 'Moderado', inefficient: 'Ineficiente' }
  return fallback[key] || fallback.moderate
}

/** insights.level (good/ok/high) alineado al perfil del dataset. */
export function categoryToInsightLevelKey(category) {
  if (category === 'LOW_CONSUMPTION') return 'good'
  if (category === 'HIGH_CONSUMPTION') return 'high'
  return 'ok'
}

/** insights.tip (good/ok/high) según perfil. */
export function categoryToTipKey(category) {
  return categoryToInsightLevelKey(category)
}
