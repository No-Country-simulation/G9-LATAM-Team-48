import Dashboard from './pages/Dashboard'
import AnalisisIA from './pages/AnalisisIA'
import MainLayout from './layouts/MainLayout'
import { useState } from 'react'


function App(){

 const [pagina,setPagina] = useState('dashboard')


 return (

  <MainLayout>


    <div className="mb-3">

      <button
        className="btn btn-dark me-2"
        onClick={()=>setPagina('dashboard')}
      >
        Dashboard
      </button>


      <button
        className="btn btn-success"
        onClick={()=>setPagina('ia')}
      >
        Análisis IA
      </button>

    </div>


    {
      pagina === 'dashboard'
      ?
      <Dashboard/>
      :
      <AnalisisIA/>
    }


  </MainLayout>

 )

}

export default App
