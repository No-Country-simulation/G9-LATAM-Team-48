import { createContext, useCallback, useContext, useState } from 'react'

const SrAnnouncerContext = createContext(null)

/**
 * Anuncios para lectores de pantalla (NVDA, JAWS, VoiceOver).
 * Uso: const announce = useAnnounce(); announce('Idioma cambiado a Español')
 */
export function SrAnnouncerProvider({ children }) {
  const [message, setMessage] = useState('')

  const announce = useCallback((text) => {
    if (!text) return
    // Reinicia el nodo para que se vuelva a leer el mismo texto si se repite.
    setMessage('')
    requestAnimationFrame(() => {
      setMessage(String(text))
    })
  }, [])

  return (
    <SrAnnouncerContext.Provider value={announce}>
      {children}
      <div className="visually-hidden" aria-live="polite" aria-atomic="true" role="status">
        {message}
      </div>
    </SrAnnouncerContext.Provider>
  )
}

export function useAnnounce() {
  const ctx = useContext(SrAnnouncerContext)
  if (!ctx) {
    return () => {}
  }
  return ctx
}
