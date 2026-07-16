function CardConsumo({ titulo, valor }) {
  return (
    <div className="col-12 col-sm-6 col-lg-4">
      <div className="card shadow mb-3 h-100">
        <div className="card-body">
          <h5 className="card-title">{titulo}</h5>
          <h2 className="mb-0">{valor}</h2>
        </div>
      </div>
    </div>
  )
}

export default CardConsumo
