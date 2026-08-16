import { useEffect, useState } from 'react'

/**
 * @param {object} [options]
 * @param {boolean} [options.enabled=true] — si false, no dispara fetch (espera datos previos).
 */
export function useFetch(fetcher, deps = [], options = {}) {
  const { enabled = true } = options
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(Boolean(enabled))
  const [error, setError] = useState(null)
  const [reloadIndex, setReloadIndex] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return undefined
    }

    let active = true

    setLoading(true)
    setError(null)

    fetcher()
      .then((res) => {
        if (active) setData(res)
      })
      .catch((err) => {
        if (active) setError(err?.message || 'Ocurrió un error inesperado')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadIndex, enabled])

  const refetch = () => setReloadIndex((index) => index + 1)

  return { data, loading, error, refetch }
}
