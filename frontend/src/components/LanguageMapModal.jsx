import { useEffect, useMemo, useRef, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { useLocale } from '../context/LocaleContext'
import { getLanguageMeta, translate } from '../i18n'
import { WORLD_COUNTRIES, WORLD_MAP_VIEWBOX } from '../data/worldMap'
import { useAnnounce } from './SrAnnouncer'

const MOBILE_MQ = '(max-width: 575.98px)'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(MOBILE_MQ).matches
      : false,
  )

  useEffect(() => {
    const media = window.matchMedia(MOBILE_MQ)
    const onChange = () => setIsMobile(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return isMobile
}

function LanguageMapModal({ show, onHide }) {
  const { t, locale, setLocale } = useLocale()
  const announce = useAnnounce()
  const isMobile = useIsMobile()
  const stageRef = useRef(null)
  const lastAnnouncedKey = useRef(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [pendingLocale, setPendingLocale] = useState(null)
  const [tipPos, setTipPos] = useState({ x: 0, y: 0, visible: false })

  useEffect(() => {
    if (!show) {
      setPendingLocale(null)
      setHoveredId(null)
      setTipPos((prev) => ({ ...prev, visible: false }))
    }
  }, [show])

  useEffect(() => {
    if (!isMobile) setPendingLocale(null)
  }, [isMobile])

  const hovered = useMemo(
    () => WORLD_COUNTRIES.find((c) => c.id === hoveredId) || null,
    [hoveredId],
  )

  const selectedMeta = getLanguageMeta(locale)
  const hoveredLocale = hovered?.locale || null
  const pendingMeta = pendingLocale ? getLanguageMeta(pendingLocale) : null

  const panelMeta = pendingMeta || selectedMeta
  const canConfirm = Boolean(
    isMobile && pendingLocale && pendingLocale !== locale,
  )
  const sideMeta = canConfirm ? selectedMeta : panelMeta

  const tipMeta = hovered
    ? hoveredLocale
      ? getLanguageMeta(hoveredLocale)
      : null
    : null

  const sortedCountries = useMemo(() => {
    return [...WORLD_COUNTRIES].sort((a, b) => {
      const score = (country) => {
        if (hoveredLocale && country.locale === hoveredLocale) return 5
        if (pendingLocale && country.locale === pendingLocale) return 4
        if (country.id === hoveredId) return 3
        if (country.locale && country.locale === locale) return 2
        if (country.locale) return 1
        return 0
      }
      return score(a) - score(b)
    })
  }, [hoveredId, hoveredLocale, pendingLocale, locale])

  useEffect(() => {
    if (!hovered) {
      lastAnnouncedKey.current = null
      return
    }

    const nextKey = hoveredLocale || `country:${hovered.id}`
    if (lastAnnouncedKey.current === nextKey) return
    lastAnnouncedKey.current = nextKey

    if (hoveredLocale && tipMeta) {
      announce(
        (isMobile
          ? t('a11y.mapWouldSelect', 'Seleccionado: {lang}. Confirmá en el panel.')
          : t('a11y.mapWouldSelectDesktop', 'Click para elegir {lang}')
        ).replace('{lang}', tipMeta.name),
      )
    } else {
      announce(
        `${hovered.name}. ${t(
          'common.noLanguageMapped',
          'Sin idioma en la app',
        )}`,
      )
    }
  }, [hovered, hoveredLocale, tipMeta, announce, t, isMobile])

  function updateTipFromEvent(event) {
    const stage = stageRef.current
    if (!stage) return
    const rect = stage.getBoundingClientRect()
    const cursorX = event.clientX - rect.left
    const cursorY = event.clientY - rect.top
    const tipW = 150
    const tipH = 44
    const pad = 10
    let left = cursorX + 14
    let top = cursorY - tipH - 10

    if (top < pad) top = cursorY + 16
    if (left + tipW > rect.width - pad) left = cursorX - tipW - 12
    if (left < pad) left = pad
    if (top + tipH > rect.height - pad) top = rect.height - tipH - pad
    if (top < pad) top = pad

    setTipPos({ x: left, y: top, visible: true })
  }

  function clearHover() {
    setHoveredId(null)
    setTipPos((prev) => ({ ...prev, visible: false }))
  }

  function applyLocale(code) {
    if (!code || code === locale) {
      onHide()
      return
    }
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

  function confirmLocale() {
    if (!pendingLocale) return
    applyLocale(pendingLocale)
  }

  function onCountryClick(country) {
    if (!country.locale) return
    if (isMobile) {
      setPendingLocale(country.locale)
      announce(
        t(
          'a11y.mapPending',
          'Idioma propuesto: {lang}. Tocá Usar este idioma para confirmar.',
        ).replace('{lang}', getLanguageMeta(country.locale).name),
      )
      return
    }
    applyLocale(country.locale)
  }

  const tipTitle = tipMeta
    ? `${tipMeta.label} · ${tipMeta.name}`
    : hovered
      ? t('common.noLanguageMapped', 'Sin idioma en la app')
      : ''

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
            'Elegí un país en el mapa y confirmá el idioma en el panel.',
          )}{' '}
          {t(
            'a11y.mapKeyboardHint',
            'Usá Tab para recorrer países con idioma. Enter o Espacio para proponerlo, luego confirmá.',
          )}
        </p>

        <div
          ref={stageRef}
          className="language-map-stage"
          onMouseLeave={clearHover}
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
              {t('common.mapSelectedLabel', 'Idioma actual')}
            </div>
            <div className="language-map-side-code">
              {sideMeta?.label || '—'}
            </div>
            <div className="language-map-side-name">
              {sideMeta?.name ||
                t('common.noLanguageMapped', 'Sin idioma en la app')}
            </div>
            {sideMeta && !sideMeta.fullUi && (
              <div className="language-map-side-note">
                {t(
                  'common.partialTranslation',
                  'Traducción parcial (inglés)',
                )}
              </div>
            )}
          </aside>

          {canConfirm && panelMeta && (
            <div
              className="language-confirm-sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby="language-confirm-title"
            >
              <div className="language-confirm-card">
                <p
                  className="language-confirm-title mb-1"
                  id="language-confirm-title"
                >
                  {t('common.mapTapToSelect', 'Tocá el idioma para seleccionarlo')}
                </p>
                <div className="language-confirm-code">{panelMeta.label}</div>
                <div className="language-confirm-name">{panelMeta.name}</div>
                {panelMeta && !panelMeta.fullUi && (
                  <div className="language-confirm-note">
                    {t(
                      'common.partialTranslation',
                      'Traducción parcial (inglés)',
                    )}
                  </div>
                )}
                <div className="language-confirm-actions">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setPendingLocale(null)}
                  >
                    {t('common.cancel', 'Cancelar')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm language-confirm-accept"
                    onClick={confirmLocale}
                  >
                    {t('common.mapConfirmLanguage', 'Usar este idioma')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {tipPos.visible && hovered && !canConfirm && (
            <div
              className={`language-map-tip${
                hoveredLocale ? ' is-mapped' : ' is-muted'
              }`}
              style={{ left: tipPos.x, top: tipPos.y }}
              aria-hidden="true"
            >
              <strong>{tipTitle}</strong>
            </div>
          )}

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
                const isPending =
                  hasLocale && pendingLocale && country.locale === pendingLocale
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
                  isPending ? 'is-pending' : '',
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
                    style={
                      isHovered
                        ? hasLocale
                          ? {
                              fill: '#ffc107',
                              stroke: 'rgba(120, 80, 0, 0.7)',
                              strokeWidth: 1.2,
                            }
                          : {
                              fill: '#9aabbc',
                              stroke: 'rgba(60, 80, 100, 0.45)',
                              strokeWidth: 0.7,
                            }
                        : isPending
                          ? {
                              fill: '#fd7e14',
                              stroke: 'rgba(120, 60, 0, 0.65)',
                              strokeWidth: 1,
                            }
                          : undefined
                    }
                    tabIndex={hasLocale ? 0 : undefined}
                    role={hasLocale ? 'button' : undefined}
                    aria-label={
                      hasLocale
                        ? `${country.name} — ${meta.label} ${meta.name}`
                        : country.name
                    }
                    onMouseEnter={(event) => {
                      setHoveredId(country.id)
                      updateTipFromEvent(event)
                    }}
                    onMouseMove={updateTipFromEvent}
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
