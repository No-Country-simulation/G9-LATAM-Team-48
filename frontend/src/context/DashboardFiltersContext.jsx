import { createContext, useContext, useMemo, useState } from 'react'
import { DEFAULT_DASHBOARD_FILTERS } from '../utils/dashboardChartFilters'

const DashboardFiltersContext = createContext(null)

export function DashboardFiltersProvider({ children }) {
  const [chartFilters, setChartFilters] = useState(DEFAULT_DASHBOARD_FILTERS)
  const [filtersVisible, setFiltersVisible] = useState(false)

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
