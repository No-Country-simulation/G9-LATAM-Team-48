import { useTheme } from '../context/ThemeContext'
import { useLocale } from '../context/LocaleContext'
import { MENU_ITEMS } from '../data/menuItems'
import MenuIcon from './MenuIcon'

function Sidebar({ pagina, setPagina, onNavigate, isMobile = false }) {
  const { theme } = useTheme()
  const { t } = useLocale()

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

  return (
    <div
      className={`sidebar ${sidebarClass} p-3 ${
        isMobile ? '' : 'h-100'
      }`}
    >
      {!isMobile && <h5 className="sidebar-title">{t('common.menu')}</h5>}
      {!isMobile && <hr />}

      <ul className="nav flex-column gap-1">
        {MENU_ITEMS.map((item) => {
          const label = t(item.labelKey)

          return (
            <li className="nav-item" key={item.id}>
              <button
                type="button"
                className={`${linkClass(item.id)} sidebar-link border-0 text-start w-100 py-2 d-flex align-items-center gap-2`}
                onClick={() => handleNavigate(item.id)}
                title={label}
              >
                <MenuIcon
                  name={item.icon}
                  color={item.color}
                  isActive={pagina === item.id}
                />
                <span className="sidebar-label">{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Sidebar
