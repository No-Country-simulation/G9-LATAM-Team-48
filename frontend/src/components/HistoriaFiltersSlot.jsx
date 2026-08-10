import HistoriaConsumosFilters from './HistoriaConsumosFilters'
import { useHistoriaFilters } from '../context/HistoriaFiltersContext'
import { useNavigation } from '../context/NavigationContext'

/** Filtros de consultas del usuario en Historia de consumos (sidebar desktop). */
export function HistoriaFiltersSidebarSlot() {
  const { pagina } = useNavigation()
  const { filters, setFilters, resetFilters, filtersVisible } = useHistoriaFilters()

  if (pagina !== 'historia-consumos' || !filtersVisible) {
    return null
  }

  return (
    <div className="sidebar-filters d-none d-lg-block">
      <HistoriaConsumosFilters
        layout="sidebar"
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
      />
    </div>
  )
}

/** Mismos filtros en móvil/tablet (contenido principal). */
export function HistoriaFiltersMainSlot() {
  const { pagina } = useNavigation()
  const { filters, setFilters, resetFilters, filtersVisible } = useHistoriaFilters()

  if (pagina !== 'historia-consumos' || !filtersVisible) {
    return null
  }

  return (
    <div className="dashboard-filters-main d-lg-none mb-3">
      <HistoriaConsumosFilters
        layout="main"
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
      />
    </div>
  )
}
