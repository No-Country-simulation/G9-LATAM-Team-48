import Modal from 'react-bootstrap/Modal'
import { useLocale } from '../context/LocaleContext'
import { LOCALE_MAP_MARKERS } from '../data/localeMapMarkers'

/** Silueta simplificada del mundo (decorativa; la interacción está en los pines). */
function WorldMapSvg({ children }) {
  return (
    <svg
      className="language-map-svg"
      viewBox="0 0 1000 500"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--lang-map-ocean-top)" />
          <stop offset="100%" stopColor="var(--lang-map-ocean-bottom)" />
        </linearGradient>
        <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--lang-map-land)" />
          <stop offset="100%" stopColor="var(--lang-map-land-deep)" />
        </linearGradient>
      </defs>

      <rect width="1000" height="500" fill="url(#oceanGrad)" rx="12" />

      {/* América del Norte */}
      <path
        fill="url(#landGrad)"
        d="M80 70c40-30 110-40 170-20 35 12 55 40 70 75 12 28 8 55-5 78-20 35-55 55-95 58-45 4-95-15-125-48-28-30-35-75-15-143z"
      />
      {/* América Central / Caribe */}
      <path
        fill="url(#landGrad)"
        d="M210 220c25 5 45 25 52 48 4 14-2 28-14 35-18 10-40 5-55-12-12-14-10-38 2-52 5-6 10-15 15-19z"
      />
      {/* América del Sur */}
      <path
        fill="url(#landGrad)"
        d="M250 275c35-8 75 5 95 40 18 32 22 75 8 115-12 35-45 65-80 72-32 6-62-12-78-42-18-35-15-85 5-120 12-22 30-55 50-65z"
      />
      {/* Europa */}
      <path
        fill="url(#landGrad)"
        d="M470 95c35-18 75-12 105 12 22 18 28 48 18 75-8 22-30 38-55 42-32 5-68-8-88-32-18-22-15-60 5-82 4-5 10-12 15-15z"
      />
      {/* África */}
      <path
        fill="url(#landGrad)"
        d="M490 175c40-5 80 15 100 50 18 32 22 78 5 115-15 32-50 55-88 55-38 0-70-28-82-65-12-38-5-85 20-118 12-16 28-32 45-37z"
      />
      {/* Asia */}
      <path
        fill="url(#landGrad)"
        d="M580 70c70-25 150-20 210 20 45 30 70 80 65 135-4 42-30 80-70 100-45 22-100 18-145-5-40-20-70-60-75-105-5-42 10-95 15-145z"
      />
      {/* Oceanía */}
      <path
        fill="url(#landGrad)"
        d="M820 320c28-8 55 5 65 30 8 20 2 42-18 52-22 12-48 5-62-15-12-18-8-45 5-58 3-3 6-7 10-9z"
      />

      <g className="language-map-grid" opacity="0.12">
        {[125, 250, 375].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="1000" y2={y} stroke="currentColor" strokeWidth="1" />
        ))}
        {[200, 400, 600, 800].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="500" stroke="currentColor" strokeWidth="1" />
        ))}
      </g>

      {children}
    </svg>
  )
}

function LanguageMapModal({ show, onHide }) {
  const { t, locale, setLocale, locales } = useLocale()

  function choose(code) {
    setLocale(code)
    onHide()
  }

  const markers = LOCALE_MAP_MARKERS.filter((m) =>
    locales.some((item) => item.code === m.code),
  )

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
      <Modal.Body>
        <p className="text-muted small mb-3">
          {t(
            'common.chooseLanguageHint',
            'Tocá un punto en el mapa o elegí el idioma en la lista.',
          )}
        </p>

        <div className="language-map-stage mb-3">
          <WorldMapSvg>
            {markers.map((marker) => {
              const active = marker.code === locale
              const label = locales.find((item) => item.code === marker.code)?.label
              return (
                <g
                  key={marker.code}
                  className={`language-map-pin${active ? ' is-active' : ''}`}
                  transform={`translate(${marker.x} ${marker.y})`}
                >
                  <title>
                    {label} — {t(`common.languages.${marker.code}`)}
                  </title>
                  <circle
                    className="language-map-pin-hit"
                    r="22"
                    fill="transparent"
                    onClick={() => choose(marker.code)}
                    style={{ cursor: 'pointer' }}
                  />
                  <circle
                    className="language-map-pin-dot"
                    r={active ? 9 : 7}
                    onClick={() => choose(marker.code)}
                    style={{ cursor: 'pointer' }}
                  />
                  <text
                    className="language-map-pin-label"
                    y="-14"
                    textAnchor="middle"
                    onClick={() => choose(marker.code)}
                    style={{ cursor: 'pointer' }}
                  >
                    {label}
                  </text>
                </g>
              )
            })}
          </WorldMapSvg>
        </div>

        <div
          className="language-map-chips"
          role="listbox"
          aria-label={t('common.language')}
        >
          {locales.map((item) => {
            const active = item.code === locale
            return (
              <button
                key={item.code}
                type="button"
                role="option"
                aria-selected={active}
                className={`language-map-chip${active ? ' is-active' : ''}`}
                onClick={() => choose(item.code)}
              >
                <span className="language-map-chip-code">{item.label}</span>
                <span className="language-map-chip-name">
                  {t(`common.languages.${item.code}`)}
                </span>
              </button>
            )
          })}
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default LanguageMapModal
