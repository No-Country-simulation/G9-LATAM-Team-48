import { useTheme } from '../context/ThemeContext'
import { useLocale } from '../context/LocaleContext'
import { useAuth } from '../context/AuthContext'
import { MENU_ITEMS } from '../data/menuItems'
import { isAdmin } from '../utils/roles'
import MenuIcon from './MenuIcon'
import { DashboardFiltersSidebarSlot } from './DashboardFiltersSlot'
import { HistoriaFiltersSidebarSlot } from './HistoriaFiltersSlot'

function Sidebar({ pagina, setPagina, onNavigate, isMobile = false }) {
  const { theme } = useTheme()
  const { t } = useLocale()
  const { user, isAuthenticated } = useAuth()
  const showAdmin = isAuthenticated && isAdmin(user)

  const mainItems = MENU_ITEMS.filter((item) => {
    if (item.adminOnly) return false
    if (item.authOnly && !isAuthenticated) return false
    return true
  })
  const adminItems = showAdmin
    ? MENU_ITEMS.filter((item) => item.adminOnly)
    : []

  const sidebarClass =
    theme === 'dark' ? 'bg-dark text-white' : 'bg-light'

  const linkClass = (id) => {
    const isActive = pagina === id
    const base = theme === 'dark' ? 'text-white' : 'text-dark'

    return `nav-link ${base}${isActive ? ' is-active' : ''}`
  }

  const handleNavigate = (id) => {
    setPagina(id)
    onNavigate?.()
  }

  function renderItems(items) {
    return items.map((item) => {
      const label = t(item.labelKey)
      const isActive = pagina === item.id

      return (
        <li className="nav-item" key={item.id}>
          <button
            type="button"
            className={`${linkClass(item.id)} sidebar-link border-0 text-start w-100 py-2 d-flex align-items-center gap-2`}
            onClick={() => handleNavigate(item.id)}
            title={label}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
          >
            <MenuIcon
              name={item.icon}
              color={item.color}
              isActive={isActive}
            />
            <span className="sidebar-label">{label}</span>
          </button>
        </li>
      )
    })
  }

  return (
    <nav
      className={`sidebar ${sidebarClass} p-3 d-flex flex-column ${isMobile ? '' : 'h-100'}`}
      aria-label={t('a11y.mainNav', 'Menú principal')}
    >
      {!isMobile && (
        <div className="sidebar-menu-spacer" aria-hidden="true" />
      )}

      <ul className="nav flex-column gap-1">{renderItems(mainItems)}</ul>

      {adminItems.length > 0 && (
        <>
          <hr className="sidebar-admin-divider my-3" aria-hidden="true" />
          <p className="sidebar-admin-heading mb-2 px-1" id="admin-nav-heading">
            {t('menu.adminPanel')}
          </p>
          <ul
            className="nav flex-column gap-1"
            aria-labelledby="admin-nav-heading"
          >
            {renderItems(adminItems)}
          </ul>
        </>
      )}

      <DashboardFiltersSidebarSlot />
      <HistoriaFiltersSidebarSlot />
    </nav>
  )
}

export default Sidebar
