import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
  } from 'recharts'
  
  
  function GraficoConsumo(){
  
    const datos = [
      {mes:'Ene', consumo:320},
      {mes:'Feb', consumo:340},
      {mes:'Mar', consumo:310},
      {mes:'Abr', consumo:360},
      {mes:'May', consumo:350},
      {mes:'Jun', consumo:380}
    ]
  
  
    return (
  
      <div className="card shadow mt-4">
  
        <div className="card-body">
  
          <h4>
            Consumo energético mensual (kWh)
          </h4>
  
  
          <ResponsiveContainer width="100%" height={300}>
  
            <LineChart data={datos}>
  
              <CartesianGrid />
  
              <XAxis dataKey="mes"/>
  
              <YAxis/>
  
              <Tooltip/>
  
              <Line 
                type="monotone"
                dataKey="consumo"
              />
  
            </LineChart>
  
          </ResponsiveContainer>
  
  
        </div>
  
      </div>
  
    )
  
  }
  
  
  export default GraficoConsumo
  