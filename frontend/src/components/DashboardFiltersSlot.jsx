import DashboardChartFilters from './DashboardChartFilters'
import { useDashboardFilters } from '../context/DashboardFiltersContext'
import { useNavigation } from '../context/NavigationContext'

/** Filtros del dataset solo en el dashboard. */
const CHART_FILTER_PAGES = new Set(['dashboard'])

function isChartFilterPage(pagina) {
  return CHART_FILTER_PAGES.has(pagina)
}

/** Filtros del dashboard bajo el menú lateral (desktop) o bajo el menú móvil. */
export function DashboardFiltersSidebarSlot() {
  const { pagina } = useNavigation()
  const { chartFilters, setChartFilters, filtersVisible } = useDashboardFilters()

  if (!isChartFilterPage(pagina) || !filtersVisible) {
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

  if (!isChartFilterPage(pagina) || !filtersVisible) {
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
