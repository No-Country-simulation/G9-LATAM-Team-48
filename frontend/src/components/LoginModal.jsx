import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Nav from 'react-bootstrap/Nav'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { DEMO_CREDENTIALS } from '../data/demoCredentials'
import {
  validateLogin,
  validateRegister,
} from '../utils/authValidation'

function fieldErrorMessage(t, code) {
  if (!code) return ''
  return t(`auth.errors.${code}`)
}

function resolveAuthError(t, message) {
  if (!message) return ''
  const known = t(`auth.errors.${message}`)
  if (known !== `auth.errors.${message}`) return known
  return message
}

function LoginModal({ show, onHide }) {
  const { login, register, loading, error } = useAuth()
  const { t } = useLocale()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!show) return
    setFieldErrors({})
    setFormError('')
  }, [show, mode])

  const usarCredenciales = (credencial) => {
    setMode('login')
    setEmail(credencial.email)
    setPassword(credencial.password)
    setName('')
    setFieldErrors({})
    setFormError('')
  }

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setFieldErrors({})
    setFormError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    const values = { name, email, password }
    const errors =
      mode === 'register' ? validateRegister(values) : validateLogin(values)

    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      setFormError(t('auth.errors.formIncomplete'))
      return
    }

    try {
      if (mode === 'register') {
        await register({
          name: name.trim(),
          email: email.trim(),
          password,
        })
      } else {
        await login(email.trim(), password)
      }
      resetForm()
      onHide()
    } catch (err) {
      setFormError(resolveAuthError(t, err.message))
    }
  }

  const isRegister = mode === 'register'

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5 mb-0">
          {isRegister ? t('auth.registerTitle') : t('auth.loginTitle')}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Nav variant="pills" className="mb-3 gap-2">
          <Nav.Item>
            <Nav.Link
              active={!isRegister}
              onClick={() => setMode('login')}
              role="button"
            >
              {t('auth.loginTab')}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={isRegister}
              onClick={() => setMode('register')}
              role="button"
            >
              {t('auth.registerTab')}
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <p className="text-muted small mb-3">
          {isRegister ? t('auth.registerHint') : t('auth.loginHint')}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {isRegister && (
            <div className="mb-3">
              <label htmlFor="auth-name" className="form-label">
                {t('auth.name')} <span className="text-danger">*</span>
              </label>
              <input
                id="auth-name"
                type="text"
                className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t('auth.namePlaceholder')}
                autoComplete="name"
                required
              />
              {fieldErrors.name && (
                <div className="invalid-feedback">
                  {fieldErrorMessage(t, fieldErrors.name)}
                </div>
              )}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="auth-email" className="form-label">
              {t('auth.email')} <span className="text-danger">*</span>
            </label>
            <input
              id="auth-email"
              type="email"
              className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t('auth.emailPlaceholder')}
              autoComplete="email"
              required
            />
            {fieldErrors.email && (
              <div className="invalid-feedback">
                {fieldErrorMessage(t, fieldErrors.email)}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="auth-password" className="form-label">
              {t('auth.password')} <span className="text-danger">*</span>
            </label>
            <input
              id="auth-password"
              type="password"
              className={`form-control ${
                fieldErrors.password ? 'is-invalid' : ''
              }`}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              required
              minLength={isRegister ? 8 : undefined}
            />
            {fieldErrors.password && (
              <div className="invalid-feedback">
                {fieldErrorMessage(t, fieldErrors.password)}
              </div>
            )}
          </div>

          {(formError || error) && (
            <div className="alert alert-danger py-2" role="alert">
              {formError || resolveAuthError(t, error)}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading
              ? isRegister
                ? t('auth.submittingRegister')
                : t('auth.submittingLogin')
              : isRegister
                ? t('auth.submitRegister')
                : t('auth.submitLogin')}
          </button>
        </form>

        <button
          type="button"
          className="btn btn-link btn-sm w-100 mt-2"
          onClick={() => setMode(isRegister ? 'login' : 'register')}
        >
          {isRegister ? t('auth.switchToLogin') : t('auth.switchToRegister')}
        </button>

        {!isRegister && (
          <div className="alert alert-info mt-3 mb-0 py-3">
            <h6 className="alert-heading mb-2">{t('auth.demoTitle')}</h6>
            <p className="small mb-2">{t('auth.demoHint')}</p>

            <ul className="small mb-3">
              {DEMO_CREDENTIALS.map((credencial) => (
                <li key={credencial.email}>
                  <strong>{t(`auth.demoRoles.${credencial.roleKey}`)}:</strong>{' '}
                  {credencial.email} / {credencial.password}
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => usarCredenciales(DEMO_CREDENTIALS[0])}
            >
              {t('auth.useDemo')}
            </button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default LoginModal
