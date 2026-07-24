import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
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

function isEmailNotVerifiedError(message) {
  if (!message) return false
  const normalized = String(message).toLowerCase()
  return (
    (normalized.includes('verificar') && normalized.includes('email')) ||
    (normalized.includes('verify') && normalized.includes('email'))
  )
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
  const [verifyLink, setVerifyLink] = useState('')
  const [needsVerification, setNeedsVerification] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  useEffect(() => {
    if (!show) {
      setInfoMessage('')
      setVerifyLink('')
      setNeedsVerification(false)
      return
    }
    setFieldErrors({})
    setFormError('')
    if (mode !== 'login') {
      setNeedsVerification(false)
    }
  }, [show, mode])

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setFieldErrors({})
    setFormError('')
    setInfoMessage('')
    setVerifyLink('')
    setNeedsVerification(false)
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
      setNeedsVerification(false)
      if (result?.verificationToken) {
        setVerifyLink(
          `${window.location.origin}/?verifyToken=${result.verificationToken}`,
        )
      } else {
        setVerifyLink('')
      }
    } catch (err) {
      setFormError(
        err?.response?.data?.message || err?.message || t('auth.resendFailed'),
      )
    } finally {
      setResendLoading(false)
    }
  }

  const handleResendFromLoginError = async () => {
    setFormError('')
    if (!email.trim()) {
      setMode('resend')
      return
    }

    setResendLoading(true)
    try {
      const result = await resendVerification(email.trim())
      setInfoMessage(result?.message || t('auth.resendSent'))
      setNeedsVerification(false)
      if (result?.verificationToken) {
        setVerifyLink(
          `${window.location.origin}/?verifyToken=${result.verificationToken}`,
        )
      } else {
        setVerifyLink('')
      }
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
    setNeedsVerification(false)

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
          setNeedsVerification(true)
          if (result?.verificationToken) {
            setVerifyLink(
              `${window.location.origin}/?verifyToken=${result.verificationToken}`,
            )
          } else {
            setVerifyLink('')
          }
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
      const message = resolveAuthError(t, err.message)
      setFormError(message)
      setNeedsVerification(isEmailNotVerifiedError(err.message || message))
    }
  }

  const isRegister = mode === 'register'
  const isForgot = mode === 'forgot'
  const isResend = mode === 'resend'
  const isEmailOnly = isForgot || isResend

  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="login-modal-dialog" contentClassName="login-modal">
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
        {(isForgot || isResend || isRegister) && (
          <p className="text-muted small mb-3">
            {isForgot
              ? t('auth.forgotHint')
              : isResend
                ? t('auth.resendHint')
                : t('auth.registerHint')}
          </p>
        )}

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
                {verifyLink && (
                  <div className="mt-2 small">
                    <div className="mb-1">{t('auth.verifyLinkFallback')}</div>
                    <a href={verifyLink} className="text-break">
                      {verifyLink}
                    </a>
                  </div>
                )}
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
              className="auth-text-link auth-text-link--spaced"
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
                {verifyLink && (
                  <div className="mt-2 small">
                    <div className="mb-1">{t('auth.verifyLinkFallback')}</div>
                    <a href={verifyLink} className="text-break">
                      {verifyLink}
                    </a>
                  </div>
                )}
                {needsVerification && !isRegister && (
                  <div className="mt-2">
                    <button
                      type="button"
                      className="auth-text-link auth-text-link--inline"
                      onClick={handleResendFromLoginError}
                      disabled={resendLoading}
                    >
                      {resendLoading
                        ? t('auth.resendSubmitting')
                        : t('auth.resendLink')}
                    </button>
                  </div>
                )}
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
          <div className="auth-text-links">
            <button
              type="button"
              className="auth-text-link"
              onClick={() => setMode(isRegister ? 'login' : 'register')}
            >
              {isRegister ? t('auth.switchToLogin') : t('auth.switchToRegister')}
            </button>

            {!isRegister && (
              <button
                type="button"
                className="auth-text-link"
                onClick={() => setMode('forgot')}
              >
                {t('auth.forgotLink')}
              </button>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default LoginModal
