import CardConsumo from '../components/CardConsumo'
import GraficoConsumo from '../components/GraficoConsumo'
import Recomendaciones from '../components/Recomendaciones'

function Dashboard() {

  return (
    <div className="container mt-4">

      <h1 className="mb-4">
        EnergyAI Dashboard
      </h1>

      <h5>
        Hackathon ONE G9 - TEAM 48
      </h5>


      <div className="row mt-4">

        <CardConsumo
          titulo="Consumo mensual"
          valor="350 kWh"
        />

        <CardConsumo
          titulo="Clasificación"
          valor="Moderado"
        />

        <CardConsumo
          titulo="Ahorro estimado"
          valor="18%"
        />

      </div>


      <GraficoConsumo />


      <Recomendaciones />

    </div>
  )
}

export default Dashboard
