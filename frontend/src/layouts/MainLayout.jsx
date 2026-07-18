import { useState } from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import LoginModal from '../components/LoginModal'
import { useLocale } from '../context/LocaleContext'

function MainLayout({ children, pagina, setPagina }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const { t } = useLocale()

  return (
    <div className="app-layout">
      <Header
        onMenuOpen={() => setMenuOpen(true)}
        onLoginClick={() => setLoginOpen(true)}
      />

      <LoginModal show={loginOpen} onHide={() => setLoginOpen(false)} />

      <Offcanvas
        show={menuOpen}
        onHide={() => setMenuOpen(false)}
        placement="start"
        className="d-md-none"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t('common.menu')}</Offcanvas.Title>
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

        <main className="app-main p-3 p-md-4">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout
