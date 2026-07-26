import { useEffect, useMemo, useRef, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { useLocale } from '../context/LocaleContext'
import { getLanguageMeta, translate } from '../i18n'
import { WORLD_COUNTRIES, WORLD_MAP_VIEWBOX } from '../data/worldMap'
import { useAnnounce } from './SrAnnouncer'

function LanguageMapModal({ show, onHide }) {
  const { t, locale, setLocale } = useLocale()
  const announce = useAnnounce()
  const lastAnnouncedKey = useRef(null)
  const [hoveredId, setHoveredId] = useState(null)

  const hovered = useMemo(
    () => WORLD_COUNTRIES.find((c) => c.id === hoveredId) || null,
    [hoveredId],
  )

  const selectedMeta = getLanguageMeta(locale)
  const hoveredLocale = hovered?.locale || null

  const focusMeta = hovered
    ? hoveredLocale
      ? getLanguageMeta(hoveredLocale)
      : null
    : selectedMeta

  const sortedCountries = useMemo(() => {
    return [...WORLD_COUNTRIES].sort((a, b) => {
      const score = (country) => {
        if (hoveredLocale && country.locale === hoveredLocale) return 4
        if (country.id === hoveredId) return 3
        if (country.locale && country.locale === locale) return 2
        if (country.locale) return 1
        return 0
      }
      return score(a) - score(b)
    })
  }, [hoveredId, hoveredLocale, locale])

  useEffect(() => {
    if (!hovered) {
      lastAnnouncedKey.current = null
      return
    }

    const nextKey = hoveredLocale || `country:${hovered.id}`
    if (lastAnnouncedKey.current === nextKey) return
    lastAnnouncedKey.current = nextKey

    if (hoveredLocale && focusMeta) {
      announce(
        t('a11y.mapWouldSelect', 'Click para elegir {lang}').replace(
          '{lang}',
          focusMeta.name,
        ),
      )
    } else {
      announce(
        `${hovered.name}. ${t(
          'common.noLanguageMapped',
          'Sin idioma en la app',
        )}`,
      )
    }
  }, [hovered, hoveredLocale, focusMeta, announce, t])

  function chooseLocale(code) {
    if (!code) return
    const meta = getLanguageMeta(code)
    const langName =
      translate(code, `common.languages.${code}`, meta?.name || code) ||
      meta?.name ||
      code
    setLocale(code)
    announce(
      translate(code, 'a11y.languageChanged', 'Language changed to {lang}').replace(
        '{lang}',
        langName,
      ),
    )
    onHide()
  }

  function onCountryClick(country) {
    if (!country.locale) return
    chooseLocale(country.locale)
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      contentClassName="language-map-modal"
      dialogClassName="language-map-dialog"
    >
      <Modal.Body className="p-0">
        <p className="visually-hidden" id="language-map-hint">
          {t(
            'common.chooseLanguageMapHint',
            'Pasá el mouse por un país y hacé click para elegir su idioma.',
          )}{' '}
          {t(
            'a11y.mapKeyboardHint',
            'Usá Tab para recorrer países con idioma. Enter o Espacio para elegir.',
          )}
        </p>

        <div
          className="language-map-stage"
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="language-map-topbar">
            <h2 className="language-map-title h6 mb-0" id="language-map-heading">
              {t('common.chooseLanguage', 'Elegí un idioma')}
            </h2>
            <button
              type="button"
              className="btn-close language-map-close"
              aria-label={t('common.close', 'Cerrar')}
              onClick={onHide}
            />
          </div>

          <aside className="language-map-side" aria-live="polite">
            <div className="language-map-side-label">
              {hovered
                ? t('common.mapHoverLabel', 'Al pasar el mouse')
                : t('common.mapSelectedLabel', 'Idioma actual')}
            </div>
            <div className="language-map-side-code">
              {focusMeta?.label || '—'}
            </div>
            <div className="language-map-side-name">
              {focusMeta?.name ||
                t('common.noLanguageMapped', 'Sin idioma en la app')}
            </div>
            {focusMeta && !focusMeta.fullUi && (
              <div className="language-map-side-note">
                {t(
                  'common.partialTranslation',
                  'Traducción parcial (inglés)',
                )}
              </div>
            )}
          </aside>

          <svg
            className="language-map-svg"
            viewBox={WORLD_MAP_VIEWBOX}
            preserveAspectRatio="xMidYMid meet"
            role="group"
            aria-labelledby="language-map-heading"
            aria-describedby="language-map-hint"
          >
            <defs>
              <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--lang-map-ocean-top)" />
                <stop
                  offset="100%"
                  stopColor="var(--lang-map-ocean-bottom)"
                />
              </linearGradient>
            </defs>

            <rect width="1000" height="500" fill="url(#oceanGrad)" rx="14" />

            <g className="language-map-grid" aria-hidden="true">
              {[62.5, 125, 187.5, 250, 312.5, 375, 437.5].map((y) => (
                <line
                  key={`h${y}`}
                  x1="0"
                  y1={y}
                  x2="1000"
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.6"
                />
              ))}
              {[125, 250, 375, 500, 625, 750, 875].map((x) => (
                <line
                  key={`v${x}`}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="500"
                  stroke="currentColor"
                  strokeWidth="0.6"
                />
              ))}
            </g>

            <g className="language-map-countries">
              {sortedCountries.map((country) => {
                const hasLocale = Boolean(country.locale)
                const isSelected = hasLocale && country.locale === locale
                const isHovered = hovered
                  ? hoveredLocale
                    ? country.locale === hoveredLocale
                    : country.id === hoveredId
                  : false
                const meta = hasLocale
                  ? getLanguageMeta(country.locale)
                  : null
                const className = [
                  'language-map-country',
                  hasLocale ? 'is-mapped' : 'is-muted',
                  isSelected ? 'is-selected' : '',
                  isHovered ? 'is-hovered' : '',
                ]
                  .filter(Boolean)
                  .join(' ')

                return (
                  <path
                    key={country.id}
                    d={country.d}
                    className={className}
                    data-locale={country.locale || undefined}
                    tabIndex={hasLocale ? 0 : undefined}
                    role={hasLocale ? 'button' : undefined}
                    aria-label={
                      hasLocale
                        ? `${country.name} — ${meta.label} ${meta.name}`
                        : country.name
                    }
                    onMouseEnter={() => setHoveredId(country.id)}
                    onFocus={() => hasLocale && setHoveredId(country.id)}
                    onBlur={() =>
                      setHoveredId((id) => (id === country.id ? null : id))
                    }
                    onClick={() => onCountryClick(country)}
                    onKeyDown={(event) => {
                      if (!hasLocale) return
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onCountryClick(country)
                      }
                    }}
                  />
                )
              })}
            </g>
          </svg>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default LanguageMapModal
