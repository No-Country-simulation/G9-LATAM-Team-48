import { useState } from 'react'
import {
  LuGlobe,
  LuLogIn,
  LuLogOut,
  LuMenu,
  LuMoon,
  LuSun,
} from 'react-icons/lu'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useLocale } from '../context/LocaleContext'
import { formatDisplayName } from '../utils/formatDisplayName'
import { useAnnounce } from './SrAnnouncer'
import LanguageMapModal from './LanguageMapModal'

function Header({ onMenuOpen, onLoginClick }) {
  const { user, logout, loading, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t, locale, locales } = useLocale()
  const announce = useAnnounce()
  const [languageOpen, setLanguageOpen] = useState(false)

  const displayName = formatDisplayName(
    user?.nombre || user?.email?.split('@')[0],
  )

  const outlineClass =
    theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark'

  const selectedLocale =
    locales.find((item) => item.code === locale) || locales[0]

  const languageName = t(
    `common.languages.${selectedLocale.code}`,
    selectedLocale.name,
  )

  function handleToggleTheme() {
    const nextIsLight = theme === 'dark'
    toggleTheme()
    announce(
      nextIsLight
        ? t('a11y.themeLightOn', 'Tema claro activado')
        : t('a11y.themeDarkOn', 'Tema oscuro activado'),
    )
  }

  async function handleLogout() {
    await logout()
    announce(t('a11y.loggedOut', 'Sesión cerrada'))
  }

  return (
    <>
      <nav
        className={`navbar ${
          theme === 'dark'
            ? 'navbar-dark bg-dark'
            : 'navbar-light bg-light border-bottom'
        }`}
        aria-label={t('a11y.topBar', 'Barra superior')}
      >
        <div className="container-fluid gap-2">
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className={`btn btn-sm d-md-none d-inline-flex align-items-center justify-content-center ${outlineClass}`}
              onClick={onMenuOpen}
              aria-label={t('common.menu')}
              title={t('common.menu')}
            >
              <LuMenu size={18} aria-hidden="true" />
            </button>

            <span className="navbar-brand brand-mark mb-0 py-0">
              <img
                src={
                  theme === 'dark'
                    ? '/logo-energia-dark.png'
                    : '/logo-energia.png'
                }
                alt={t('a11y.logoAlt', 'EnergIA, inicio')}
                className="brand-logo"
                width="160"
                height="110"
                decoding="async"
              />
            </span>
          </div>

          <div className="d-flex align-items-center gap-2 ms-auto">
            <button
              type="button"
              className={`btn btn-sm d-inline-flex align-items-center gap-1 ${outlineClass}`}
              onClick={() => setLanguageOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={languageOpen}
              aria-label={`${t('common.language')}: ${languageName}`}
              title={`${t('common.language')}: ${languageName}`}
            >
              <LuGlobe size={16} aria-hidden="true" />
              <span className="header-lang-code" aria-hidden="true">
                {selectedLocale.label}
              </span>
            </button>

            <button
              type="button"
              className={`btn btn-sm d-inline-flex align-items-center justify-content-center ${outlineClass}`}
              onClick={handleToggleTheme}
              aria-label={
                theme === 'dark'
                  ? t('common.themeLight')
                  : t('common.themeDark')
              }
              title={
                theme === 'dark'
                  ? t('common.themeLight')
                  : t('common.themeDark')
              }
            >
              {theme === 'dark' ? (
                <LuSun
                  size={18}
                  className="header-theme-icon header-theme-icon--sun"
                  aria-hidden="true"
                />
              ) : (
                <LuMoon
                  size={18}
                  className="header-theme-icon header-theme-icon--moon"
                  aria-hidden="true"
                />
              )}
            </button>

            <div
              className={`vr d-none d-sm-block ${
                theme === 'dark' ? 'text-white' : ''
              }`}
              aria-hidden="true"
            />

            {isAuthenticated ? (
              <>
                <span
                  className="d-none d-sm-inline header-user-name"
                  title={displayName}
                >
                  {displayName}
                </span>
                <span className="visually-hidden">
                  {t('a11y.signedInAs', 'Sesión iniciada como {name}').replace(
                    '{name}',
                    displayName,
                  )}
                </span>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger d-inline-flex align-items-center justify-content-center"
                  onClick={handleLogout}
                  disabled={loading}
                  aria-label={t('common.logout')}
                  title={t('common.logout')}
                >
                  <LuLogOut size={16} aria-hidden="true" />
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-sm btn-primary d-inline-flex align-items-center justify-content-center"
                onClick={onLoginClick}
                aria-label={t('common.login')}
                title={t('common.login')}
              >
                <LuLogIn size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </nav>

      <LanguageMapModal
        show={languageOpen}
        onHide={() => setLanguageOpen(false)}
      />
    </>
  )
}

export default Header
