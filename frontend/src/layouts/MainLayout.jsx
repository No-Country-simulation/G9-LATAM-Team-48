import { useEffect, useState } from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import LoginModal from '../components/LoginModal'
import { DashboardFiltersMainSlot } from '../components/DashboardFiltersSlot'
import { HistoriaFiltersMainSlot } from '../components/HistoriaFiltersSlot'
import { useLocale } from '../context/LocaleContext'
import { useAuth } from '../context/AuthContext'
import { useAnnounce } from '../components/SrAnnouncer'
import { translate } from '../i18n'
import { SESSION_EXPIRED_EVENT } from '../utils/session'

const PAGE_LABEL_KEYS = {
  dashboard: 'menu.dashboard',
  consumos: 'menu.consumos',
  'historia-consumos': 'menu.historiaConsumos',
  ia: 'menu.ia',
  recomendaciones: 'menu.recomendaciones',
  contacto: 'menu.contacto',
  equipo: 'menu.equipo',
  'admin-usuarios': 'menu.adminUsuarios',
  'admin-analisis': 'menu.adminAnalisis',
  'reset-password': 'auth.resetTitle',
  'verify-email': 'auth.verifyTitle',
}

function MainLayout({ children, pagina, setPagina, onAuthSuccess }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, locale } = useLocale()
  const { loginOpen, openLogin, closeLogin } = useAuth()
  const announce = useAnnounce()

  useEffect(() => {
    function onSessionExpired() {
      setMenuOpen(false)
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired)
  }, [])

  useEffect(() => {
    const key = PAGE_LABEL_KEYS[pagina]
    if (!key) {
      document.title = 'EnergIA'
      return
    }
    const pageName = translate(locale, key)
    document.title = `EnergIA — ${pageName}`
    announce(
      translate(locale, 'a11y.pageChanged', 'Página: {page}').replace(
        '{page}',
        pageName,
      ),
    )
  }, [pagina, locale, announce])

  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">
        {t('common.skipToContent', 'Saltar al contenido')}
      </a>
      <a href="#main-nav" className="skip-link skip-link--second">
        {t('a11y.skipToNav', 'Saltar al menú')}
      </a>

      <header>
        <Header
          onMenuOpen={() => setMenuOpen(true)}
          onLoginClick={openLogin}
        />
      </header>

      <LoginModal
        show={loginOpen}
        onHide={closeLogin}
        onAuthSuccess={onAuthSuccess}
      />

      <Offcanvas
        show={menuOpen}
        onHide={() => setMenuOpen(false)}
        placement="start"
        className="d-md-none"
        aria-label={t('common.menu')}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="visually-hidden">
            {t('common.menu')}
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="p-0">
          <Sidebar
            pagina={pagina}
            setPagina={setPagina}
            onNavigate={() => setMenuOpen(false)}
            isMobile
          />
        </Offcanvas.Body>
      </Offcanvas>

      <div className="app-body">
        <aside
          id="main-nav"
          className="app-sidebar d-none d-md-block"
          aria-label={t('a11y.mainNav', 'Menú principal')}
        >
          <Sidebar pagina={pagina} setPagina={setPagina} />
        </aside>

        <main id="main-content" className="app-main p-3 p-md-4" tabIndex={-1}>
          <DashboardFiltersMainSlot />
          <HistoriaFiltersMainSlot />
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout
