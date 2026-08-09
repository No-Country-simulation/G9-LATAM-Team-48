import DashboardChartFilters from './DashboardChartFilters'
import { useDashboardFilters } from '../context/DashboardFiltersContext'
import { useNavigation } from '../context/NavigationContext'

/** Filtros del dashboard bajo el menú lateral (desktop) o bajo el menú móvil. */
export function DashboardFiltersSidebarSlot() {
  const { pagina } = useNavigation()
  const { chartFilters, setChartFilters, filtersVisible } = useDashboardFilters()

  if (pagina !== 'dashboard' || !filtersVisible) {
    return null
  }

  return (
    <div className="sidebar-filters d-none d-lg-block">
      <DashboardChartFilters
        layout="sidebar"
        filters={chartFilters}
        onChange={setChartFilters}
      />
    </div>
  )
}

/** Misma barra de filtros cuando el menú lateral está colapsado (tablet/móvil). */
export function DashboardFiltersMainSlot() {
  const { pagina } = useNavigation()
  const { chartFilters, setChartFilters, filtersVisible } = useDashboardFilters()

  if (pagina !== 'dashboard' || !filtersVisible) {
    return null
  }

  return (
    <div className="dashboard-filters-main d-lg-none mb-3">
      <DashboardChartFilters
        layout="main"
        filters={chartFilters}
        onChange={setChartFilters}
      />
    </div>
  )
}
