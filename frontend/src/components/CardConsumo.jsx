function CardConsumo({ titulo, valor }) {
  return (
    <div className="col-12 col-sm-6 col-lg-4">
      <div
        className="card shadow mb-0 h-100"
        role="group"
        aria-label={`${titulo}: ${valor}`}
      >
        <div className="card-body">
          <p className="card-title mb-1">{titulo}</p>
          <p className="fs-2 fw-semibold mb-0">{valor}</p>
        </div>
      </div>
    </div>
  )
}

export default CardConsumo
