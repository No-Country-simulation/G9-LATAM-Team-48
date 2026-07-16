function Loader({ mensaje = 'Cargando...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Cargando</span>
      </div>
      <span>{mensaje}</span>
    </div>
  )
}

export default Loader
