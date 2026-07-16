import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
  } from 'recharts'
  import { useTheme } from '../context/ThemeContext'
  import consumoData from '../data/consumo.json'
  
  
  function GraficoConsumo({ consumos = consumoData }){
  
    const { theme } = useTheme()
    const gridColor = theme === 'dark' ? '#444' : '#ccc'
    const textColor = theme === 'dark' ? '#ccc' : '#333'
    const lineColor = theme === 'dark' ? '#6ea8fe' : '#0d6efd'
  
    const datos = consumos.map((item) => ({
      mes: item.mes.slice(0, 3),
      consumo: item.consumo,
    }))
  
  
    return (
  
      <div className="card shadow mt-4">
  
        <div className="card-body">
  
          <h4>
            Consumo energético mensual (kWh)
          </h4>
  
  
          <ResponsiveContainer width="100%" height={300}>
  
            <LineChart data={datos}>
  
              <CartesianGrid stroke={gridColor} />
  
              <XAxis dataKey="mes" stroke={textColor} tick={{ fill: textColor }} />
  
              <YAxis stroke={textColor} tick={{ fill: textColor }} />
  
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#212529' : '#fff',
                  borderColor: gridColor,
                  color: textColor
                }}
              />
  
              <Line
                type="monotone"
                dataKey="consumo"
                stroke={lineColor}
                strokeWidth={2}
              />
  
            </LineChart>
  
          </ResponsiveContainer>
  
  
        </div>
  
      </div>
  
    )
  
  }
  
  
  export default GraficoConsumo
  