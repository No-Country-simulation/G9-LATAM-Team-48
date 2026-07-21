import { useEffect, useState } from 'react'

export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadIndex, setReloadIndex] = useState(0)

  useEffect(() => {
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
  }, [...deps, reloadIndex])

  const refetch = () => setReloadIndex((index) => index + 1)

  return { data, loading, error, refetch }
}
