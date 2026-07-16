import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { formatDisplayName } from '../utils/formatDisplayName'

function Header({ onMenuOpen, onLoginClick }) {
  const { user, logout, loading, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const displayName = formatDisplayName(
    user?.nombre || user?.email?.split('@')[0]
  )

  return (
    <nav
      className={`navbar ${
        theme === 'dark'
          ? 'navbar-dark bg-dark'
          : 'navbar-light bg-light border-bottom'
      }`}
    >
      <div className="container-fluid gap-2">
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className={`btn btn-sm d-md-none ${
              theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark'
            }`}
            onClick={onMenuOpen}
            aria-label="Abrir menú"
          >
            ☰
          </button>

          <span className="navbar-brand mb-0 h1 fs-5 fs-md-3">⚡ EnergyAI</span>
        </div>

        <div className="d-flex align-items-center gap-2 gap-md-3 ms-auto">
          <button
            type="button"
            className={`btn btn-sm ${
              theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark'
            }`}
            onClick={toggleTheme}
            aria-label="Cambiar tema"
          >
            <span className="d-inline d-md-none">
              {theme === 'dark' ? '☀️' : '🌙'}
            </span>
            <span className="d-none d-md-inline">
              {theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
            </span>
          </button>

          <div
            className={`vr d-none d-sm-block ${
              theme === 'dark' ? 'text-white' : ''
            }`}
          />

          {isAuthenticated ? (
            <>
              <span
                className={`d-none d-sm-inline small ${
                  theme === 'dark' ? 'text-white' : 'text-dark'
                }`}
              >
                {displayName}
              </span>

              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={logout}
                disabled={loading}
              >
                <span className="d-inline d-sm-none">Salir</span>
                <span className="d-none d-sm-inline">Cerrar sesión</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={onLoginClick}
            >
              <span className="d-inline d-sm-none">Entrar</span>
              <span className="d-none d-sm-inline">Iniciar sesión</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header
