import { useState } from 'react'
import { LuLinkedin, LuGithub, LuFileText } from 'react-icons/lu'
import { useLocale } from '../context/LocaleContext'
import { EQUIPO_48 } from '../data/equipo'

function MemberAvatar({ member }) {
  const [broken, setBroken] = useState(false)
  const showPhoto = member.photo && !broken

  if (showPhoto) {
    return (
      <img
        src={member.photo}
        alt={member.name}
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

function Equipo48() {
  const { t } = useLocale()

  return (
    <div className="container-fluid px-0 px-sm-2 page-content">
      <h1 className="mb-2 fs-3 fs-md-2">{t('team.title')}</h1>
      <p className="text-muted mb-4">{t('team.subtitle')}</p>

      <div className="row g-3">
        {EQUIPO_48.map((member) => {
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
            member.cv && {
              href: member.cv,
              label: t('team.cv'),
              Icon: LuFileText,
            },
          ].filter(Boolean)

          return (
            <div className="col-12 col-md-6 col-xl-4" key={member.id}>
              <article className="equipo-card h-100">
                <div className="d-flex align-items-center gap-3">
                  <MemberAvatar member={member} />
                  <div className="min-w-0 flex-grow-1">
                    <h2 className="h6 mb-1 text-truncate">{member.name}</h2>
                    <p className="mb-0 small text-muted">
                      {t(`team.roles.${member.roleKey}`)}
                    </p>
                  </div>
                </div>

                {links.length > 0 ? (
                  <div className="equipo-links mt-3 d-flex flex-wrap gap-2">
                    {links.map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                      >
                        <Icon aria-hidden="true" />
                        {label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="small text-muted mb-0 mt-3">{t('team.linksSoon')}</p>
                )}
              </article>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Equipo48
