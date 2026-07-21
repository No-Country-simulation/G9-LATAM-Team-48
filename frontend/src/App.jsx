import Dashboard from './pages/Dashboard'
import Consumos from './pages/Consumos'
import AnalisisIA from './pages/AnalisisIA'
import RecomendacionesPage from './pages/RecomendacionesPage'
import Contacto from './pages/Contacto'
import AdminUsuarios from './pages/AdminUsuarios'
import AdminAnalisis from './pages/AdminAnalisis'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import MainLayout from './layouts/MainLayout'
import { useEffect, useState } from 'react'
import { useAuth } from './context/AuthContext'
import { isAdmin } from './utils/roles'
import { getStoredPagina, setStoredPagina } from './utils/session'

function readQueryParam(name) {
  try {
    return new URLSearchParams(window.location.search).get(name)
  } catch {
    return null
  }
}

function App() {
  const initialReset = readQueryParam('resetToken')
  const initialVerify = readQueryParam('verifyToken')
  const [pagina, setPaginaState] = useState(() => {
    if (initialVerify) return 'verify-email'
    if (initialReset) return 'reset-password'
    return getStoredPagina('dashboard')
  })
  const [resetToken, setResetToken] = useState(initialReset)
  const [verifyToken, setVerifyToken] = useState(initialVerify)
  const { user, hydrating, isAuthenticated } = useAuth()

  const setPagina = (next) => {
    setPaginaState((current) => {
      const value = typeof next === 'function' ? next(current) : next
      setStoredPagina(value)
      return value
    })
  }

  useEffect(() => {
    if (hydrating) return

    const isAdminPage =
      pagina === 'admin-usuarios' || pagina === 'admin-analisis'

    // Sin sesion: no quedarse en admin
    if (isAdminPage && !isAuthenticated) {
      setPagina('dashboard')
      return
    }

    // Con sesion no-admin: sacar de admin
    if (isAdminPage && user && !isAdmin(user)) {
      setPagina('dashboard')
    }
  }, [pagina, user, hydrating, isAuthenticated])

  const clearReset = () => {
    setResetToken(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('resetToken')
    window.history.replaceState({}, '', url)
    setPagina(isAdmin(user) ? 'admin-usuarios' : 'dashboard')
  }

  const clearVerify = () => {
    setVerifyToken(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('verifyToken')
    window.history.replaceState({}, '', url)
    setPagina('dashboard')
  }

  const handleAuthSuccess = (session) => {
    if (isAdmin(session?.user)) {
      setPagina('admin-usuarios')
    } else {
      setPagina('dashboard')
    }
  }

  const renderPagina = () => {
    switch (pagina) {
      case 'consumos':
        return <Consumos />
      case 'ia':
        return <AnalisisIA />
      case 'recomendaciones':
        return <RecomendacionesPage />
      case 'contacto':
      case 'equipo':
        return <Contacto />
      case 'admin-usuarios':
        return <AdminUsuarios />
      case 'admin-analisis':
        return <AdminAnalisis />
      case 'reset-password':
        return <ResetPassword token={resetToken} onDone={clearReset} />
      case 'verify-email':
        return <VerifyEmail token={verifyToken} onDone={clearVerify} />
      default:
        return <Dashboard />
    }
  }

  return (
    <MainLayout
      pagina={pagina}
      setPagina={setPagina}
      onAuthSuccess={handleAuthSuccess}
    >
      {renderPagina()}
    </MainLayout>
  )
}

export default App
