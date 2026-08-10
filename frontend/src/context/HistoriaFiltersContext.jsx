import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_HISTORIA_FILTERS } from '../utils/historiaConsumoFilters'

const STORAGE_KEY = 'energia.historia.filters'

const HistoriaFiltersContext = createContext(null)

function readStoredFilters() {
  if (typeof sessionStorage === 'undefined') {
    return DEFAULT_HISTORIA_FILTERS
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_HISTORIA_FILTERS
    return { ...DEFAULT_HISTORIA_FILTERS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_HISTORIA_FILTERS
  }
}

export function HistoriaFiltersProvider({ children }) {
  const [filters, setFilters] = useState(readStoredFilters)
  const [filtersVisible, setFiltersVisible] = useState(false)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
    } catch {
      /* ignore */
    }
  }, [filters])

  const resetFilters = () => setFilters(DEFAULT_HISTORIA_FILTERS)

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      resetFilters,
      filtersVisible,
      setFiltersVisible,
    }),
    [filters, filtersVisible],
  )

  return (
    <HistoriaFiltersContext.Provider value={value}>
      {children}
    </HistoriaFiltersContext.Provider>
  )
}

export function useHistoriaFilters() {
  const ctx = useContext(HistoriaFiltersContext)
  if (!ctx) {
    throw new Error('useHistoriaFilters debe usarse dentro de HistoriaFiltersProvider')
  }
  return ctx
}
