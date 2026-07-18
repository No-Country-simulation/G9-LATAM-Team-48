import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useLocale } from '../context/LocaleContext'
import { formatDisplayName } from '../utils/formatDisplayName'

function Header({ onMenuOpen, onLoginClick }) {
  const { user, logout, loading, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t, locale, setLocale, locales } = useLocale()

  const displayName = formatDisplayName(
    user?.nombre || user?.email?.split('@')[0]
  )

  const outlineClass =
    theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark'

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
            className={`btn btn-sm d-md-none ${outlineClass}`}
            onClick={onMenuOpen}
            aria-label={t('common.menu')}
          >
            ☰
          </button>

          <span className="navbar-brand mb-0 h1 fs-5 fs-md-3">⚡ EnergyAI</span>
        </div>

        <div className="d-flex align-items-center gap-2 gap-md-3 ms-auto">
          <label className="visually-hidden" htmlFor="locale-select">
            {t('common.language')}
          </label>
          <select
            id="locale-select"
            className="form-select form-select-sm w-auto"
            value={locale}
            onChange={(event) => setLocale(event.target.value)}
            aria-label={t('common.language')}
          >
            {locales.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label} — {t(`common.languages.${item.code}`)}
              </option>
            ))}
          </select>

          <button
            type="button"
            className={`btn btn-sm ${outlineClass}`}
            onClick={toggleTheme}
            aria-label={t('common.themeLight')}
          >
            <span className="d-inline d-md-none">
              {theme === 'dark' ? '☀️' : '🌙'}
            </span>
            <span className="d-none d-md-inline">
              {theme === 'dark'
                ? `☀️ ${t('common.themeLight')}`
                : `🌙 ${t('common.themeDark')}`}
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
                <span className="d-inline d-sm-none">
                  {t('common.logoutShort')}
                </span>
                <span className="d-none d-sm-inline">{t('common.logout')}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={onLoginClick}
            >
              <span className="d-inline d-sm-none">
                {t('common.loginShort')}
              </span>
              <span className="d-none d-sm-inline">{t('common.login')}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header
