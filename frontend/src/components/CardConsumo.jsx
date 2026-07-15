function CardConsumo({titulo, valor}) {

    return (
   
     <div className="col-md-4">
   
       <div className="card shadow mb-3">
   
         <div className="card-body">
   
           <h5>
             {titulo}
           </h5>
   
           <h2>
             {valor}
           </h2>
   
         </div>
   
       </div>
   
     </div>
   
    )
   
   }
   
   export default CardConsumo
   