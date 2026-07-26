import { useState } from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import LoginModal from '../components/LoginModal'
import { useLocale } from '../context/LocaleContext'
import { useAuth } from '../context/AuthContext'

function MainLayout({ children, pagina, setPagina, onAuthSuccess }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useLocale()
  const { loginOpen, openLogin, closeLogin } = useAuth()

  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">
        {t('common.skipToContent', 'Saltar al contenido')}
      </a>

      <Header
        onMenuOpen={() => setMenuOpen(true)}
        onLoginClick={openLogin}
      />

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
        <aside className="app-sidebar d-none d-md-block">
          <Sidebar pagina={pagina} setPagina={setPagina} />
        </aside>

        <main id="main-content" className="app-main p-3 p-md-4" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout
