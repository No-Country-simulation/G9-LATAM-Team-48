import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Nav from 'react-bootstrap/Nav'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import {
  forgotPassword,
  resendVerification,
} from '../services/passwordService'
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

function LoginModal({ show, onHide, onAuthSuccess }) {
  const { login, register, loading, error } = useAuth()
  const { t } = useLocale()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  useEffect(() => {
    if (!show) {
      setInfoMessage('')
      return
    }
    setFieldErrors({})
    setFormError('')
  }, [show, mode])

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setFieldErrors({})
    setFormError('')
    setInfoMessage('')
  }

  const handleForgot = async (event) => {
    event.preventDefault()
    setFormError('')
    setInfoMessage('')
    if (!email.trim()) {
      setFormError(t('auth.errors.required'))
      return
    }

    setForgotLoading(true)
    try {
      const result = await forgotPassword(email.trim())
      // Solo el link del mail abre la pantalla de reset
      setInfoMessage(result?.message || t('auth.forgotSent'))
    } catch (err) {
      setFormError(err?.response?.data?.message || err?.message || t('auth.forgotFailed'))
    } finally {
      setForgotLoading(false)
    }
  }

  const handleResend = async (event) => {
    event.preventDefault()
    setFormError('')
    setInfoMessage('')
    if (!email.trim()) {
      setFormError(t('auth.errors.required'))
      return
    }

    setResendLoading(true)
    try {
      const result = await resendVerification(email.trim())
      setInfoMessage(result?.message || t('auth.resendSent'))
    } catch (err) {
      setFormError(
        err?.response?.data?.message || err?.message || t('auth.resendFailed'),
      )
    } finally {
      setResendLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setInfoMessage('')

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
        const result = await register({
          name: name.trim(),
          email: email.trim(),
          password,
        })
        if (result?.pendingVerification || !result?.token) {
          // No auto-verificar: el usuario debe usar el link del email
          setInfoMessage(result.message || t('auth.registerVerifySent'))
          setMode('login')
          setPassword('')
          return
        }
        resetForm()
        onAuthSuccess?.(result)
        onHide()
        return
      }

      const session = await login(email.trim(), password)
      resetForm()
      onAuthSuccess?.(session)
      onHide()
    } catch (err) {
      setFormError(resolveAuthError(t, err.message))
    }
  }

  const isRegister = mode === 'register'
  const isForgot = mode === 'forgot'
  const isResend = mode === 'resend'
  const isEmailOnly = isForgot || isResend

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5 mb-0">
          {isForgot
            ? t('auth.forgotTitle')
            : isResend
              ? t('auth.resendTitle')
              : isRegister
                ? t('auth.registerTitle')
                : t('auth.loginTitle')}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!isEmailOnly && (
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
        )}

        <p className="text-muted small mb-3">
          {isForgot
            ? t('auth.forgotHint')
            : isResend
              ? t('auth.resendHint')
              : isRegister
                ? t('auth.registerHint')
                : t('auth.loginHint')}
        </p>

        {isEmailOnly ? (
          <form
            onSubmit={isResend ? handleResend : handleForgot}
            noValidate
          >
            <div className="mb-3">
              <label htmlFor="auth-email" className="form-label">
                {t('auth.email')} <span className="text-danger">*</span>
              </label>
              <input
                id="auth-email"
                type="email"
                className="form-control"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            {(formError || infoMessage) && (
              <div
                className={`alert py-2 ${infoMessage ? 'alert-success' : 'alert-danger'}`}
                role="alert"
              >
                {infoMessage || formError}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isResend ? resendLoading : forgotLoading}
            >
              {isResend
                ? resendLoading
                  ? t('auth.resendSubmitting')
                  : t('auth.resendSubmit')
                : forgotLoading
                  ? t('auth.forgotSubmitting')
                  : t('auth.forgotSubmit')}
            </button>

            <button
              type="button"
              className="btn btn-link btn-sm w-100 mt-2"
              onClick={() => setMode('login')}
            >
              {t('auth.switchToLogin')}
            </button>
          </form>
        ) : (
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

            {(formError || error || infoMessage) && (
              <div
                className={`alert py-2 ${infoMessage ? 'alert-success' : 'alert-danger'}`}
                role="alert"
              >
                {infoMessage || formError || resolveAuthError(t, error)}
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
        )}

        {!isEmailOnly && (
          <>
            <button
              type="button"
              className="btn btn-link btn-sm w-100 mt-2"
              onClick={() => setMode(isRegister ? 'login' : 'register')}
            >
              {isRegister ? t('auth.switchToLogin') : t('auth.switchToRegister')}
            </button>

            {!isRegister && (
              <>
                <button
                  type="button"
                  className="btn btn-link btn-sm w-100"
                  onClick={() => setMode('forgot')}
                >
                  {t('auth.forgotLink')}
                </button>
                <button
                  type="button"
                  className="btn btn-link btn-sm w-100"
                  onClick={() => setMode('resend')}
                >
                  {t('auth.resendLink')}
                </button>
              </>
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default LoginModal
