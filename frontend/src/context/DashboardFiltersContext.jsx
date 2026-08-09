import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_DASHBOARD_FILTERS } from '../utils/dashboardChartFilters'

const STORAGE_KEY = 'energia.dashboard.chartFilters'

const DashboardFiltersContext = createContext(null)

function readStoredFilters() {
  if (typeof sessionStorage === 'undefined') {
    return DEFAULT_DASHBOARD_FILTERS
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_DASHBOARD_FILTERS
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_DASHBOARD_FILTERS, ...parsed, tipoInmueble: undefined }
  } catch {
    return DEFAULT_DASHBOARD_FILTERS
  }
}

export function DashboardFiltersProvider({ children }) {
  const [chartFilters, setChartFilters] = useState(readStoredFilters)
  const [filtersVisible, setFiltersVisible] = useState(false)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(chartFilters))
    } catch {
      /* quota / private mode */
    }
  }, [chartFilters])

  const value = useMemo(
    () => ({
      chartFilters,
      setChartFilters,
      filtersVisible,
      setFiltersVisible,
    }),
    [chartFilters, filtersVisible],
  )

  return (
    <DashboardFiltersContext.Provider value={value}>
      {children}
    </DashboardFiltersContext.Provider>
  )
}

export function useDashboardFilters() {
  const ctx = useContext(DashboardFiltersContext)
  if (!ctx) {
    throw new Error('useDashboardFilters debe usarse dentro de DashboardFiltersProvider')
  }
  return ctx
}
