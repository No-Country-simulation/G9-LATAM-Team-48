function ErrorState({ mensaje = 'No se pudieron cargar los datos.', onRetry }) {
  return (
    <div
      className="alert alert-danger d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2"
      role="alert"
    >
      <span>{mensaje}</span>

      {onRetry && (
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={onRetry}
        >
          Reintentar
        </button>
      )}
    </div>
  )
}

export default ErrorState
