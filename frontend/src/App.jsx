import Dashboard from './pages/Dashboard'
import Consumos from './pages/Consumos'
import AnalisisIA from './pages/AnalisisIA'
import RecomendacionesPage from './pages/RecomendacionesPage'
import MainLayout from './layouts/MainLayout'
import { useState } from 'react'

function App() {
  const [pagina, setPagina] = useState('dashboard')

  const renderPagina = () => {
    switch (pagina) {
      case 'consumos':
        return <Consumos />
      case 'ia':
        return <AnalisisIA />
      case 'recomendaciones':
        return <RecomendacionesPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <MainLayout pagina={pagina} setPagina={setPagina}>
      {renderPagina()}
    </MainLayout>
  )
}

export default App
