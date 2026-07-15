function Recomendaciones(){

    const recomendaciones = [
      "Cambiar iluminación tradicional por LED",
      "Reducir consumo en horarios pico",
      "Optimizar uso del aire acondicionado",
      "Evaluar equipos antiguos de alto consumo"
    ]
   
   
    return (
   
     <div className="card shadow mt-4">
   
       <div className="card-body">
   
         <h4>
           Recomendaciones IA
         </h4>
   
   
         <ul>
   
         {
           recomendaciones.map((item,index)=>(
             <li key={index}>
               {item}
             </li>
           ))
         }
   
         </ul>
   
   
       </div>
   
     </div>
   
    )
   
   }
   
   export default Recomendaciones