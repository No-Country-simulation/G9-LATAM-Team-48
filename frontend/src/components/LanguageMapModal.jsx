import { useMemo, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { useLocale } from '../context/LocaleContext'
import { getLanguageMeta } from '../i18n'
import { WORLD_COUNTRIES, WORLD_MAP_VIEWBOX } from '../data/worldMap'

function LanguageMapModal({ show, onHide }) {
  const { t, locale, setLocale } = useLocale()
  const [hoveredId, setHoveredId] = useState(null)

  const hovered = useMemo(
    () => WORLD_COUNTRIES.find((c) => c.id === hoveredId) || null,
    [hoveredId],
  )

  const selectedCountries = useMemo(
    () => WORLD_COUNTRIES.filter((c) => c.locale === locale),
    [locale],
  )

  const selectedMeta = getLanguageMeta(locale)

  const focusCountry = hovered || selectedCountries[0] || null
  const focusMeta = focusCountry?.locale
    ? getLanguageMeta(focusCountry.locale)
    : selectedMeta

  const sortedCountries = useMemo(() => {
    return [...WORLD_COUNTRIES].sort((a, b) => {
      const score = (country) => {
        if (country.id === hoveredId) return 3
        if (country.locale && country.locale === locale) return 2
        if (country.locale) return 1
        return 0
      }
      return score(a) - score(b)
    })
  }, [hoveredId, locale])

  function chooseLocale(code) {
    if (!code) return
    setLocale(code)
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
    >
      <Modal.Header closeButton>
        <Modal.Title className="h5 mb-0">
          {t('common.chooseLanguage', 'Elegí un idioma')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pb-3">
        <p className="text-muted small mb-3">
          {t(
            'common.chooseLanguageMapHint',
            'Pasá el mouse por un país y hacé click para elegir su idioma.',
          )}
        </p>

        <div className="language-map-layout">
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
              {focusMeta?.name || '—'}
            </div>
            <div className="language-map-side-country">
              {hovered
                ? hovered.name
                : selectedCountries.length > 1
                  ? t('common.mapSelectedCountries', '{count} países').replace(
                      '{count}',
                      String(selectedCountries.length),
                    )
                  : focusCountry?.name ||
                    t('common.mapPickCountry', 'Elegí un país en el mapa')}
            </div>
            {focusMeta && !focusMeta.fullUi && (
              <div className="language-map-side-note">
                {t(
                  'common.partialTranslation',
                  'Traducción parcial (UI en inglés)',
                )}
              </div>
            )}
          </aside>

          <div
            className="language-map-stage"
            onMouseLeave={() => setHoveredId(null)}
          >
            <svg
              className="language-map-svg"
              viewBox={WORLD_MAP_VIEWBOX}
              role="img"
              aria-label={t('common.chooseLanguage', 'Elegí un idioma')}
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
                  const isHovered = country.id === hoveredId
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
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default LanguageMapModal
