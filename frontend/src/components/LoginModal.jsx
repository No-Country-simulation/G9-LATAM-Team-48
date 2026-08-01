import { useCallback, useEffect, useRef, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import GoogleSignInButton, {
  isGoogleSignInConfigured,
} from './GoogleSignInButton'
import {
  GOOGLE_CLICK_WATCH_MS,
  installGoogleSignInConsoleProbe,
  isLikelyGoogleAuthPopupUrl,
} from '../utils/googleSignInSupport'
import {
  forgotPassword,
  resendVerification,
} from '../services/passwordService'
import {
  validateLogin,
  validateRegister,
} from '../utils/authValidation'
import { useAnnounce } from './SrAnnouncer'

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
  const { login, register, loginWithGoogle, loading, error } = useAuth()
  const { t } = useLocale()
  const announce = useAnnounce()
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
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleBlockDetected, setGoogleBlockDetected] = useState(false)
  const googleClickWatchRef = useRef(null)
  const googleAuthStartedRef = useRef(false)
  const googleBlurListenerRef = useRef(null)
  const googleUserClickedRef = useRef(false)
  const showGoogle = isGoogleSignInConfigured() && (mode === 'login' || mode === 'register')

  const showGoogleBlockAfterClick = useCallback(() => {
    if (!googleUserClickedRef.current) return
    setGoogleBlockDetected(true)
  }, [])

  const clearGoogleClickWatch = useCallback(() => {
    if (googleClickWatchRef.current) {
      window.clearTimeout(googleClickWatchRef.current)
      googleClickWatchRef.current = null
    }
    if (googleBlurListenerRef.current) {
      window.removeEventListener('blur', googleBlurListenerRef.current)
      googleBlurListenerRef.current = null
    }
  }, [])

  const markGoogleAuthStarted = useCallback(() => {
    googleAuthStartedRef.current = true
    clearGoogleClickWatch()
  }, [clearGoogleClickWatch])

  const scheduleGoogleClickWatch = useCallback(() => {
    googleUserClickedRef.current = true
    clearGoogleClickWatch()
    googleAuthStartedRef.current = false

    const onBlur = () => {
      markGoogleAuthStarted()
    }
    googleBlurListenerRef.current = onBlur
    window.addEventListener('blur', onBlur)

    googleClickWatchRef.current = window.setTimeout(() => {
      googleClickWatchRef.current = null
      if (googleBlurListenerRef.current) {
        window.removeEventListener('blur', googleBlurListenerRef.current)
        googleBlurListenerRef.current = null
      }
      if (!googleAuthStartedRef.current) {
        showGoogleBlockAfterClick()
      }
    }, GOOGLE_CLICK_WATCH_MS)
  }, [clearGoogleClickWatch, markGoogleAuthStarted, showGoogleBlockAfterClick])

  const handleGoogleCredential = async (credential) => {
    markGoogleAuthStarted()
    setFormError('')
    setInfoMessage('')
    setGoogleLoading(true)
    try {
      const session = await loginWithGoogle(credential)
      resetForm()
      onAuthSuccess?.(session)
      onHide()
    } catch (err) {
      setFormError(resolveAuthError(t, err.message))
    } finally {
      setGoogleLoading(false)
    }
  }

  useEffect(() => {
    if (!show) {
      setInfoMessage('')
      setVerifyLink('')
      setNeedsVerification(false)
      setGoogleBlockDetected(false)
      googleUserClickedRef.current = false
      return
    }
    setFieldErrors({})
    setFormError('')
    if (mode !== 'login') {
      setNeedsVerification(false)
    }
  }, [show, mode])

  const modalTitle =
    mode === 'forgot'
      ? t('auth.forgotTitle')
      : mode === 'resend'
        ? t('auth.resendTitle')
        : mode === 'register'
          ? t('auth.registerTitle')
          : t('auth.loginTitle')

  useEffect(() => {
    if (!show) return
    announce(
      `${t('a11y.loginDialogOpened', 'Ventana de inicio de sesión abierta')}. ${modalTitle}`,
    )
  }, [show, modalTitle, announce, t])

  useEffect(() => {
    if (!show || !showGoogle) {
      clearGoogleClickWatch()
      googleUserClickedRef.current = false
      return undefined
    }

    const onPopupBlocked = () => {
      showGoogleBlockAfterClick()
      markGoogleAuthStarted()
    }

    const restoreConsole = installGoogleSignInConsoleProbe(onPopupBlocked)

    const nativeOpen = window.open.bind(window)
    window.open = (url, target, features) => {
      const popup = nativeOpen(url, target, features)
      if (isLikelyGoogleAuthPopupUrl(url) && googleUserClickedRef.current) {
        if (!popup) {
          showGoogleBlockAfterClick()
        } else {
          markGoogleAuthStarted()
          window.setTimeout(() => {
            try {
              if (popup.closed) showGoogleBlockAfterClick()
            } catch {
              // cross-origin: popup abierto cuenta como progreso
            }
          }, 600)
        }
      }
      return popup
    }

    return () => {
      restoreConsole()
      window.open = nativeOpen
      clearGoogleClickWatch()
    }
  }, [show, showGoogle, clearGoogleClickWatch, markGoogleAuthStarted, showGoogleBlockAfterClick])

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setFieldErrors({})
    setFormError('')
    setInfoMessage('')
    setVerifyLink('')
    setNeedsVerification(false)
    setGoogleBlockDetected(false)
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
      setVerifyLink('')
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
      setVerifyLink('')
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
    setVerifyLink('')

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
          // Debe validar por el link del mail; no mostramos el token en la UI
          setInfoMessage(result.message || t('auth.registerVerifySent'))
          setNeedsVerification(true)
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
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="login-modal-dialog"
      contentClassName="login-modal"
      aria-labelledby="login-modal-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="login-modal-title" className="h5 mb-0">
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
        <p className="text-muted small mb-3" id="login-modal-hint">
          {isForgot
            ? t('auth.forgotHint')
            : isResend
              ? t('auth.resendHint')
              : isRegister
                ? t('auth.registerHint')
                : t('auth.loginHint')}
        </p>

        {showGoogle && (
          <div
            className="mb-3"
            role="group"
            aria-label={t('a11y.googleSignInRegion', 'Inicio de sesión con Google')}
            onPointerDownCapture={(event) => {
              const host = event.currentTarget.querySelector('.google-signin-host')
              if (!host) return
              if (event.target === host || host.contains(event.target)) {
                scheduleGoogleClickWatch()
              }
            }}
          >
            {googleBlockDetected && (
              <div className="alert alert-warning py-2 small mb-2" role="status">
                {t('auth.googleBlockHint')}
              </div>
            )}
            <GoogleSignInButton
              onCredential={handleGoogleCredential}
              onBlocked={showGoogleBlockAfterClick}
              ariaLabel={t('a11y.googleSignInButton', 'Continuar con Google')}
              onError={(code) => {
                if (code === 'googleScriptFailed') {
                  showGoogleBlockAfterClick()
                  setFormError('')
                  return
                }
                setFormError(resolveAuthError(t, code || 'googleLoginFailed'))
              }}
              disabled={loading || googleLoading}
            />
            <div className="auth-divider my-3 text-center text-muted small">
              <span>{t('auth.orContinueWithEmail', 'o continuá con email')}</span>
            </div>
          </div>
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
          <form onSubmit={handleSubmit} noValidate aria-describedby="login-modal-hint">
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
