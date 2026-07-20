import { useState } from 'react'
import { useLocale } from '../context/LocaleContext'
import { sendContactMessage } from '../services/contactService'

function Contacto() {
  const { t } = useLocale()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setOk(false)

    if (!name.trim() || !email.trim() || message.trim().length < 10) {
      setError(t('contact.errors.incomplete'))
      return
    }

    setLoading(true)
    try {
      await sendContactMessage({ name, email, message })
      setOk(true)
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          t('contact.errors.sendFailed'),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid px-0 px-sm-2 page-content">
      <h1 className="mb-2 fs-3 fs-md-2">{t('contact.title')}</h1>
      <p className="text-muted mb-4">{t('contact.subtitle')}</p>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <form onSubmit={handleSubmit} noValidate>
            {ok && (
              <div className="alert alert-success py-2" role="status">
                {t('contact.success')}
              </div>
            )}
            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label" htmlFor="contact-name">
                {t('contact.name')} <span className="text-danger">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                maxLength={120}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="contact-email">
                {t('contact.email')} <span className="text-danger">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="contact-message">
                {t('contact.message')} <span className="text-danger">*</span>
              </label>
              <textarea
                id="contact-message"
                className="form-control"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={10}
                maxLength={2000}
              />
              <div className="form-text">{t('contact.messageHint')}</div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t('contact.submitting') : t('contact.submit')}
            </button>
          </form>
        </div>

        <div className="col-12 col-lg-5">
          <div className="border rounded-3 p-3 h-100">
            <h2 className="h5 mb-2">{t('contact.infoTitle')}</h2>
            <p className="text-muted small mb-3">{t('contact.infoText')}</p>
            <p className="mb-1">
              <strong>{t('contact.infoEmailLabel')}:</strong>{' '}
              <a href="mailto:energyiaTeam48@gmail.com">energyiaTeam48@gmail.com</a>
            </p>
            <p className="mb-0 small text-muted">{t('contact.infoNote')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contacto
