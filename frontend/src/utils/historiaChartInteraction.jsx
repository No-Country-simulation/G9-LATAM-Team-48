/** Misma consulta aunque id venga number/string del API o del gráfico. */
export function historiaRowIdsEqual(a, b) {
  if (a == null || b == null) return false
  return String(a) === String(b)
}

export function pageIndexForHistoriaRow(list, id, pageSize) {
  const idx = (list ?? []).findIndex((r) => historiaRowIdsEqual(r.id, id))
  if (idx < 0) return null
  return Math.floor(idx / pageSize)
}

/**
 * Hover sobre puntos o línea: usa índice del tooltip de Recharts o payload activo.
 * @param {Array<{ id?: unknown }>} seriesData filas ya ordenadas como en el gráfico
 */
export function historiaChartHoverHandlers(seriesData, onPointHover, onPointLeave) {
  if (!onPointHover && !onPointLeave) return {}

  const resolveId = (state) => {
    const fromPayload = state?.activePayload?.[0]?.payload?.id
    if (fromPayload != null) return fromPayload
    const idx = state?.activeTooltipIndex
    if (typeof idx === 'number' && idx >= 0 && seriesData?.[idx]?.id != null) {
      return seriesData[idx].id
    }
    return null
  }

  return {
    onMouseMove: (state) => {
      const id = resolveId(state)
      if (id != null) onPointHover?.(id)
    },
    onMouseLeave: () => onPointLeave?.(),
  }
}

export function HistoriaChartDot({
  cx,
  cy,
  payload,
  fill,
  highlightedPointId,
  onPointHover,
  activeStroke,
  baseRadius = 5,
  activeRadius = 8,
  hitRadius = 16,
}) {
  if (cx == null || cy == null) return null

  const pointId = payload?.id
  const active =
    highlightedPointId != null && historiaRowIdsEqual(highlightedPointId, pointId)

  const notifyHover = () => {
    if (pointId != null) onPointHover?.(pointId)
  }

  return (
    <g className="historia-chart-dot">
      <circle
        cx={cx}
        cy={cy}
        r={hitRadius}
        fill="transparent"
        pointerEvents="all"
        onMouseEnter={notifyHover}
        onFocus={notifyHover}
        style={{ cursor: onPointHover ? 'pointer' : undefined }}
      />
      <circle
        cx={cx}
        cy={cy}
        r={active ? activeRadius : baseRadius}
        fill={fill}
        stroke={active ? activeStroke : 'none'}
        strokeWidth={active ? 2 : 0}
        pointerEvents="none"
      />
    </g>
  )
}
