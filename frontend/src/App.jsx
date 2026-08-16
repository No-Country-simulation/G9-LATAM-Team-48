import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Dashboard from './pages/Dashboard'
import MainLayout from './layouts/MainLayout'
import { useAuth } from './context/AuthContext'
import { useLocale } from './context/LocaleContext'
import { NavigationProvider } from './context/NavigationContext'
import { DashboardFiltersProvider } from './context/DashboardFiltersContext'
import { HistoriaFiltersProvider } from './context/HistoriaFiltersContext'
import { isAdmin } from './utils/roles'
import {
  SESSION_EXPIRED_EVENT,
  paginaRequiresAuth,
  resolveInitialPagina,
  setStoredPagina,
} from './utils/session'
import Loader from './components/Loader'

const Consumos = lazy(() => import('./pages/Consumos'))
const HistoriaConsumos = lazy(() => import('./pages/HistoriaConsumos'))
const AnalisisIA = lazy(() => import('./pages/AnalisisIA'))
const RecomendacionesPage = lazy(() => import('./pages/RecomendacionesPage'))
const Contacto = lazy(() => import('./pages/Contacto'))
const AdminUsuarios = lazy(() => import('./pages/AdminUsuarios'))
const AdminAnalisis = lazy(() => import('./pages/AdminAnalisis'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'))

const PAGE_TITLE_KEYS = {
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
  const [pagina, setPaginaState] = useState(() =>
    resolveInitialPagina({
      verifyToken: initialVerify,
      resetToken: initialReset,
    }),
  )
  const [resetToken, setResetToken] = useState(initialReset)
  const [verifyToken, setVerifyToken] = useState(initialVerify)
  const { user, hydrating, isAuthenticated, sessionEpoch } = useAuth()
  const { t } = useLocale()

  const setPagina = (next) => {
    setPaginaState((current) => {
      const value = typeof next === 'function' ? next(current) : next
      setStoredPagina(value)
      return value
    })
  }

  const setPaginaRef = useRef(setPagina)
  setPaginaRef.current = setPagina

  useEffect(() => {
    function onSessionExpired() {
      setPaginaRef.current((current) =>
        current === 'verify-email' || current === 'reset-password'
          ? current
          : 'dashboard',
      )
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired)
  }, [])

  useEffect(() => {
    const key = PAGE_TITLE_KEYS[pagina]
    const pageLabel = key ? t(key) : t('menu.dashboard')
    document.title = `${pageLabel} | EnergIA`
  }, [pagina, t])

  useEffect(() => {
    if (hydrating) return
    if (isAuthenticated) return

    const isAuthFlow =
      pagina === 'verify-email' || pagina === 'reset-password'
    if (isAuthFlow) return

    if (paginaRequiresAuth(pagina)) {
      setPagina('dashboard')
    }
  }, [pagina, hydrating, isAuthenticated])

  useEffect(() => {
    if (hydrating) return

    const isAdminPage =
      pagina === 'admin-usuarios' || pagina === 'admin-analisis'

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
    if (paginaRequiresAuth(pagina)) {
      if (hydrating) {
        return <Loader />
      }
      if (!isAuthenticated) {
        return <Dashboard />
      }
    }

    let view
    switch (pagina) {
      case 'consumos':
        view = <Consumos />
        break
      case 'historia-consumos':
        view = <HistoriaConsumos />
        break
      case 'ia':
        view = <AnalisisIA />
        break
      case 'recomendaciones':
        view = <RecomendacionesPage />
        break
      case 'contacto':
      case 'equipo':
        view = <Contacto />
        break
      case 'admin-usuarios':
        view = <AdminUsuarios />
        break
      case 'admin-analisis':
        view = <AdminAnalisis />
        break
      case 'reset-password':
        view = <ResetPassword token={resetToken} onDone={clearReset} />
        break
      case 'verify-email':
        view = <VerifyEmail token={verifyToken} onDone={clearVerify} />
        break
      default:
        return <Dashboard />
    }

    return (
      <Suspense fallback={<Loader />}>
        {view}
      </Suspense>
    )
  }

  return (
    <NavigationProvider pagina={pagina} setPagina={setPagina}>
      <DashboardFiltersProvider>
        <HistoriaFiltersProvider>
          <MainLayout
            key={`layout-${sessionEpoch}`}
            pagina={pagina}
            setPagina={setPagina}
            onAuthSuccess={handleAuthSuccess}
          >
            <div key={`view-${sessionEpoch}-${pagina}`}>{renderPagina()}</div>
          </MainLayout>
        </HistoriaFiltersProvider>
      </DashboardFiltersProvider>
    </NavigationProvider>
  )
}

export default App
