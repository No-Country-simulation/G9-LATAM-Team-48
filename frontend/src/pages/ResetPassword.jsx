import { useState } from 'react'
import { resetPassword } from '../services/passwordService'
import { useLocale } from '../context/LocaleContext'

function ResetPassword({ token, onDone }) {
  const { t } = useLocale()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!token) {
      setError(t('auth.resetMissingToken'))
      return
    }
    if (password.length < 8) {
      setError(t('auth.errors.passwordMin'))
      return
    }
    if (password !== confirm) {
      setError(t('auth.resetMismatch'))
      return
    }

    setLoading(true)
    try {
      await resetPassword(token, password)
      setOk(true)
      onDone?.()
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || t('auth.resetFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid px-0 px-sm-2" style={{ maxWidth: 420 }}>
      <h1 className="fs-3 mb-2">{t('auth.resetTitle')}</h1>
      <p className="text-muted mb-3">{t('auth.resetHint')}</p>

      {ok ? (
        <div className="alert alert-success mb-0">{t('auth.resetSuccess')}</div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger py-2">{error}</div>}

          <div className="mb-2">
            <label className="form-label" htmlFor="reset-password">
              {t('auth.newPassword')}
            </label>
            <input
              id="reset-password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="reset-confirm">
              {t('auth.confirmPassword')}
            </label>
            <input
              id="reset-confirm"
              type="password"
              className="form-control"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? t('auth.resetSubmitting') : t('auth.resetSubmit')}
          </button>
        </form>
      )}
    </div>
  )
}

export default ResetPassword
