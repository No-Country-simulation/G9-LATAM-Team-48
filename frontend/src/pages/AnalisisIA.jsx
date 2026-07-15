import { useState } from 'react'
import { analizarConsumo } from '../services/iaService'


function AnalisisIA(){

  const [datos, setDatos] = useState({
    consumo: '',
    personas: '',
    equipos: ''
  })


  const [resultado, setResultado] = useState(null)


  function cambiarCampo(e){

    setDatos({
      ...datos,
      [e.target.name]: e.target.value
    })

  }


  function analizar(){

    const respuesta = analizarConsumo({
      consumo: Number(datos.consumo),
      personas: Number(datos.personas),
      equipos: Number(datos.equipos)
    })


    setResultado(respuesta)

  }


  return (

    <div className="container">

      <h1>
        Análisis Inteligente IA
      </h1>

      <p>
        Evaluación del consumo energético
      </p>


      <div className="card shadow p-4">

        <div className="mb-3">

          <label>
            Consumo mensual (kWh)
          </label>

          <input
            className="form-control"
            name="consumo"
            value={datos.consumo}
            onChange={cambiarCampo}
          />

        </div>


        <div className="mb-3">

          <label>
            Cantidad de personas
          </label>

          <input
            className="form-control"
            name="personas"
            value={datos.personas}
            onChange={cambiarCampo}
          />

        </div>


        <div className="mb-3">

          <label>
            Cantidad de equipos
          </label>

          <input
            className="form-control"
            name="equipos"
            value={datos.equipos}
            onChange={cambiarCampo}
          />

        </div>


        <button
          className="btn btn-primary"
          onClick={analizar}
        >
          Analizar consumo
        </button>


      </div>


      {
        resultado && (

          <div className="card shadow mt-4 p-4">

            <h3>
              Resultado IA
            </h3>


            <h4>
              Nivel:
              {" "}
              {resultado.nivel}
            </h4>


            <h4>
              Ahorro estimado:
              {" "}
              {resultado.ahorro}%
            </h4>


            <hr/>


            <h5>
              Recomendaciones
            </h5>


            <ul>

            {
              resultado.recomendaciones.map(
                (r,index)=>(
                  <li key={index}>
                    {r}
                  </li>
                )
              )
            }

            </ul>


          </div>

        )

      }


    </div>

  )

}


export default AnalisisIA
