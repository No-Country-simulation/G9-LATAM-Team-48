/**
 * Dominio Y con el mismo margen relativo arriba y abajo (por defecto 15%).
 * Evita que un valor (ej. 59) quede pegado al borde del gráfico.
 */
export function yDomainWithPadding(valores, { ratio = 0.15, floorZero = true } = {}) {
  const nums = (valores || []).map(Number).filter(Number.isFinite)
  if (!nums.length) return [0, 1]

  const dataMin = Math.min(...nums)
  const dataMax = Math.max(...nums)
  const pad = Math.max(
    Math.abs(dataMax) * ratio,
    Math.abs(dataMin) * ratio,
    (dataMax - dataMin) * ratio,
    1,
  )

  let yMin = dataMin - pad
  const yMax = dataMax + pad
  if (floorZero) yMin = Math.max(0, yMin)

  return [Math.floor(yMin), Math.ceil(yMax)]
}
