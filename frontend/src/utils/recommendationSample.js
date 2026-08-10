/** Orden de categorías alineado a `recommendations.category` (i18n). */
export const RECOMMENDATION_CATEGORY_ORDER = [
  'habits',
  'climate',
  'lighting',
  'equipment',
  'tech',
]

function randomFrom(list) {
  if (!list?.length) return null
  return list[Math.floor(Math.random() * list.length)]
}

/**
 * Una recomendación al azar por cada `categoryKey` presente en el listado (catálogo / personal).
 * @param {Array<{ id: unknown, categoryKey?: string }>} items
 */
export function pickOneRandomPerCategory(items) {
  if (!items?.length) return []

  const byCategory = new Map()
  for (const item of items) {
    const key = item.categoryKey || 'habits'
    if (!byCategory.has(key)) byCategory.set(key, [])
    byCategory.get(key).push(item)
  }

  const known = RECOMMENDATION_CATEGORY_ORDER.filter((key) => byCategory.has(key))
  const rest = [...byCategory.keys()]
    .filter((key) => !RECOMMENDATION_CATEGORY_ORDER.includes(key))
    .sort()

  return [...known, ...rest]
    .map((category) => randomFrom(byCategory.get(category)))
    .filter(Boolean)
}
