import { useEffect, useRef } from 'react'

const GIS_SRC = 'https://accounts.google.com/gsi/client'
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

function loadGisScript() {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (window.google?.accounts?.id) return Promise.resolve(true)
  const existing = document.querySelector(`script[src="${GIS_SRC}"]`)
  if (existing) {
    return new Promise((resolve) => {
      if (window.google?.accounts?.id) {
        resolve(true)
        return
      }
      existing.addEventListener('load', () => resolve(true))
    })
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = GIS_SRC
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => reject(new Error('googleScriptFailed'))
    document.head.appendChild(script)
  })
}

/**
 * Botón oficial de Google Identity Services.
 * Visible solo si VITE_GOOGLE_CLIENT_ID está definido.
 */
export default function GoogleSignInButton({ onCredential, onError, disabled = false }) {
  const hostRef = useRef(null)
  const onCredentialRef = useRef(onCredential)
  const onErrorRef = useRef(onError)
  const enabled = Boolean(CLIENT_ID?.trim())

  useEffect(() => {
    onCredentialRef.current = onCredential
    onErrorRef.current = onError
  }, [onCredential, onError])

  useEffect(() => {
    if (!enabled || !hostRef.current || disabled) return undefined
    let cancelled = false

    loadGisScript()
      .then(() => {
        if (cancelled || !hostRef.current || !window.google?.accounts?.id) return
        hostRef.current.innerHTML = ''
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID.trim(),
          callback: (response) => {
            if (response?.credential) {
              onCredentialRef.current?.(response.credential)
            } else {
              onErrorRef.current?.('googleNoCredential')
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        })
        window.google.accounts.id.renderButton(hostRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 320,
        })
      })
      .catch(() => {
        if (!cancelled) onErrorRef.current?.('googleScriptFailed')
      })

    return () => {
      cancelled = true
    }
  }, [enabled, disabled])

  if (!enabled) return null

  return (
    <div
      ref={hostRef}
      className="google-signin-host d-flex justify-content-center w-100"
      aria-busy={disabled || undefined}
    />
  )
}

export function isGoogleSignInConfigured() {
  return Boolean(CLIENT_ID?.trim())
}
