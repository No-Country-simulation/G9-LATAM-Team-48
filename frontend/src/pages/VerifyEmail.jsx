import { useEffect, useState } from 'react'
import { verifyEmail } from '../services/passwordService'
import { useLocale } from '../context/LocaleContext'
import { useAuth } from '../context/AuthContext'

function VerifyEmail({ token, onDone }) {
  const { t } = useLocale()
  const { openLogin } = useAuth()
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

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
          <button type="button" className="btn btn-outline-primary" onClick={onDone}>
            {t('auth.verifyBack')}
          </button>
        </div>
      )}
    </div>
  )
}

export default VerifyEmail
