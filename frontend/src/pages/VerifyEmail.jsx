import { useEffect, useState } from 'react'
import {
  resendVerification,
  verifyEmail,
} from '../services/passwordService'
import { useLocale } from '../context/LocaleContext'
import { useAuth } from '../context/AuthContext'

function VerifyEmail({ token, onDone }) {
  const { t } = useLocale()
  const { openLogin } = useAuth()
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [resendError, setResendError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!token) {
        setStatus('error')
        setError(t('auth.verifyMissingToken'))
        return
      }

      try {
        await verifyEmail(token)
        if (!cancelled) setStatus('ok')
      } catch (err) {
        if (!cancelled) {
          setStatus('error')
          setError(
            err?.response?.data?.message ||
              err?.message ||
              t('auth.verifyFailed'),
          )
        }
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [token, t])

  const handleGoLogin = () => {
    onDone?.()
    openLogin()
  }

  const handleResend = async (event) => {
    event.preventDefault()
    setResendMessage('')
    setResendError('')
    if (!email.trim()) {
      setResendError(t('auth.errors.required'))
      return
    }

    setResendLoading(true)
    try {
      const result = await resendVerification(email.trim())
      setResendMessage(result?.message || t('auth.resendSent'))
    } catch (err) {
      setResendError(
        err?.response?.data?.message || err?.message || t('auth.resendFailed'),
      )
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="container-fluid px-0 px-sm-2" style={{ maxWidth: 420 }}>
      <h1 className="fs-3 mb-2">{t('auth.verifyTitle')}</h1>
      <p className="text-muted mb-3">{t('auth.verifyHint')}</p>

      {status === 'loading' && (
        <div className="alert alert-info mb-0">{t('auth.verifyLoading')}</div>
      )}

      {status === 'ok' && (
        <div className="d-grid gap-2">
          <div className="alert alert-success mb-0">{t('auth.verifySuccess')}</div>
          <button type="button" className="btn btn-primary" onClick={handleGoLogin}>
            {t('auth.verifyGoLogin')}
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="d-grid gap-2">
          <div className="alert alert-danger mb-0">{error}</div>

          <form onSubmit={handleResend} noValidate className="mt-2">
            <p className="text-muted small mb-2">{t('auth.resendHint')}</p>
            <div className="mb-2">
              <label htmlFor="verify-resend-email" className="form-label">
                {t('auth.email')}
              </label>
              <input
                id="verify-resend-email"
                type="email"
                className="form-control"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            {(resendMessage || resendError) && (
              <div
                className={`alert py-2 ${resendMessage ? 'alert-success' : 'alert-danger'}`}
                role="alert"
              >
                {resendMessage || resendError}
              </div>
            )}
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={resendLoading}
            >
              {resendLoading ? t('auth.resendSubmitting') : t('auth.resendSubmit')}
            </button>
          </form>

          <button type="button" className="btn btn-outline-primary" onClick={onDone}>
            {t('auth.verifyBack')}
          </button>
        </div>
      )}
    </div>
  )
}

export default VerifyEmail
