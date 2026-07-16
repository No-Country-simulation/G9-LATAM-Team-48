import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { useAuth } from '../context/AuthContext'
import { DEMO_CREDENTIALS } from '../data/demoCredentials'

function LoginModal({ show, onHide }) {
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')

  const usarCredenciales = (credencial) => {
    setEmail(credencial.email)
    setPassword(credencial.password)
    setFormError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    if (!email || !password) {
      setFormError('Completa email y contraseña')
      return
    }

    try {
      await login(email, password)
      setEmail('')
      setPassword('')
      onHide()
    } catch (err) {
      setFormError(err.message)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5 mb-0">⚡ Iniciar sesión</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="text-muted small mb-3">
          Ingresá para poder editar datos y cargar información. La navegación es
          libre sin necesidad de cuenta.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="login-email" className="form-label">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="operador@energyai.com"
              autoComplete="email"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="login-password" className="form-label">
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              className="form-control"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {(formError || error) && (
            <div className="alert alert-danger py-2" role="alert">
              {formError || error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="alert alert-info mt-4 mb-0 py-3">
          <h6 className="alert-heading mb-2">Credenciales de ejemplo</h6>
          <p className="small mb-2">
            Usá cualquiera de estas cuentas mientras el backend no esté
            conectado:
          </p>

          <ul className="small mb-3">
            {DEMO_CREDENTIALS.map((credencial) => (
              <li key={credencial.email}>
                <strong>{credencial.label}:</strong> {credencial.email} /{' '}
                {credencial.password}
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => usarCredenciales(DEMO_CREDENTIALS[0])}
          >
            Usar operador de ejemplo
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default LoginModal
