import { useRef, useState } from 'react'
import {
  LuLinkedin,
  LuGithub,
  LuFileText,
  LuMail,
  LuInstagram,
  LuGlobe,
  LuUsers,
} from 'react-icons/lu'
import { useLocale } from '../context/LocaleContext'
import { sendContactMessage } from '../services/contactService'
import { EQUIPO_48 } from '../data/equipo'

function MemberAvatar({ member }) {
  const [broken, setBroken] = useState(false)
  const showPhoto = member.photo && !broken

  if (showPhoto) {
    return (
      <img
        src={member.photo}
        alt=""
        className="equipo-avatar"
        onError={() => setBroken(true)}
      />
    )
  }

  return (
    <span className="equipo-avatar equipo-avatar--initials" aria-hidden="true">
      {member.initials}
    </span>
  )
}

function TeamFlipCard({ member, flipped, onToggle, t }) {
  const lockRef = useRef(false)
  const links = [
    member.linkedin && {
      href: member.linkedin,
      label: t('team.linkedin'),
      Icon: LuLinkedin,
    },
    member.github && {
      href: member.github,
      label: t('team.github'),
      Icon: LuGithub,
    },
    member.portfolio && {
      href: member.portfolio,
      label: t('team.portfolio'),
      Icon: LuGlobe,
    },
    member.instagram && {
      href: member.instagram,
      label: t('team.instagram'),
      Icon: LuInstagram,
    },
    member.email && {
      href: `mailto:${member.email}`,
      label: t('team.email'),
      Icon: LuMail,
    },
    member.cv && {
      href: member.cv,
      label: t('team.cv'),
      Icon: LuFileText,
    },
  ].filter(Boolean)

  const handleToggle = () => {
    // Evita spam de clicks durante la animación (scrollbar / jitter).
    if (lockRef.current) return
    lockRef.current = true
    onToggle()
    window.setTimeout(() => {
      lockRef.current = false
    }, 560)
  }

  const onKeyToggle = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleToggle()
    }
  }

  return (
    <div className="equipo-flip">
      <div
        className={`equipo-flip-inner${flipped ? ' is-flipped' : ''}`}
        aria-expanded={flipped}
      >
        <div
          className="equipo-face equipo-face--front"
          role="button"
          tabIndex={0}
          onClick={handleToggle}
          onKeyDown={onKeyToggle}
          aria-label={`${member.name}. ${t('team.flipFront')}`}
        >
          <MemberAvatar member={member} />
          <div className="min-w-0 w-100">
            <h3 className="h6 equipo-name text-truncate">{member.name}</h3>
            <p className="mb-0 text-muted equipo-role">
              {t(`team.roles.${member.roleKey}`)}
            </p>
            <p className="mb-0 mt-1 small text-primary">{t('team.tapHint')}</p>
          </div>
        </div>

        <div
          className="equipo-face equipo-face--back"
          role="button"
          tabIndex={0}
          onClick={handleToggle}
          onKeyDown={onKeyToggle}
          aria-label={`${member.name}. ${t('team.tapBack')}`}
        >
          <div className="w-100">
            <h3 className="h6 equipo-name text-truncate">{member.name}</h3>
            <p className="text-muted mb-2 equipo-role">
              {t(`team.roles.${member.roleKey}`)}
            </p>
            {links.length > 0 ? (
              <div className="equipo-links">
                {links.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="equipo-link-icon"
                    title={label}
                    aria-label={label}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Icon aria-hidden="true" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="small text-muted mb-2">{t('team.linksSoon')}</p>
            )}
            <p className="mb-0 mt-2 small text-primary">{t('team.tapBack')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Contacto() {
  const { t } = useLocale()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)
  const [flippedId, setFlippedId] = useState(null)

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

      <div className="row g-4 mb-5">
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
            <div className="contact-team-badge mt-3" aria-label="Hackathon ONE G9 — G9-LATAM-Team 48">
              <p className="contact-team-badge__event mb-2">Hackathon ONE G9</p>
              <div className="contact-team-badge__row">
                <LuUsers
                  className="contact-team-badge__icon"
                  size={18}
                  aria-hidden="true"
                />
                <span className="contact-team-badge__name">G9-LATAM-Team 48</span>
                <span className="contact-team-badge__count">
                  <span className="contact-team-badge__count-num">8</span>{' '}
                  <span className="contact-team-badge__count-label">
                    {t('contact.membersLabel', 'integrantes')}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section aria-labelledby="equipo-heading">
        <h2 id="equipo-heading" className="h4 mb-2">
          {t('team.title')}
        </h2>
        <p className="text-muted mb-3">{t('team.subtitle')}</p>

        <div className="equipo-grid">
          {EQUIPO_48.map((member) => (
            <TeamFlipCard
              key={member.id}
              member={member}
              flipped={flippedId === member.id}
              onToggle={() =>
                setFlippedId((current) =>
                  current === member.id ? null : member.id,
                )
              }
              t={t}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Contacto
