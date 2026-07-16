function EmptyState({ mensaje = 'No hay datos para mostrar.' }) {
  return (
    <div className="text-center text-muted py-5">
      <p className="mb-0">{mensaje}</p>
    </div>
  )
}

export default EmptyState
