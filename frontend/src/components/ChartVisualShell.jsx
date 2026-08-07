import { useEffect, useRef } from 'react'

/**
 * Contenedor visual del gráfico (oculto para lectores de pantalla).
 * Recharts pone tabindex="0" en el SVG; lo anulamos para no violar aria-hidden.
 */
export default function ChartVisualShell({ children, className, style }) {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return undefined

    const neutralize = () => {
      root.querySelectorAll('svg[tabindex="0"]').forEach((node) => {
        node.setAttribute('tabindex', '-1')
      })
      root.querySelectorAll('[role="application"]').forEach((node) => {
        node.removeAttribute('role')
      })
    }

    neutralize()
    const observer = new MutationObserver(() => {
      observer.disconnect()
      neutralize()
      observer.observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['tabindex', 'role'],
      })
    })
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['tabindex', 'role'],
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      aria-hidden="true"
    >
      {children}
    </div>
  )
}
