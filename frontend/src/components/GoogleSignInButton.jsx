import { useEffect, useRef } from 'react'
import { loadGoogleIdentityScript } from '../utils/googleSignInSupport'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const RENDER_WATCH_MS = 2500

function hostHasGoogleButton(host) {
  if (!host) return false
  return Boolean(
    host.querySelector('iframe') ||
      host.querySelector('[role="button"]') ||
      host.querySelector('div[tabindex]'),
  )
}

/**
 * Botón oficial de Google Identity Services.
 * Visible solo si VITE_GOOGLE_CLIENT_ID está definido.
 */
export default function GoogleSignInButton({
  onCredential,
  onError,
  onBlocked,
  disabled = false,
}) {
  const hostRef = useRef(null)
  const onCredentialRef = useRef(onCredential)
  const onErrorRef = useRef(onError)
  const onBlockedRef = useRef(onBlocked)
  const enabled = Boolean(CLIENT_ID?.trim())

  useEffect(() => {
    onCredentialRef.current = onCredential
    onErrorRef.current = onError
    onBlockedRef.current = onBlocked
  }, [onCredential, onError, onBlocked])

  useEffect(() => {
    if (!enabled || !hostRef.current || disabled) return undefined
    let cancelled = false

    let renderTimer

    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !hostRef.current || !window.google?.accounts?.id) {
          if (!cancelled) {
            onBlockedRef.current?.('script')
            onErrorRef.current?.('googleScriptFailed')
          }
          return
        }
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
        renderTimer = window.setTimeout(() => {
          if (cancelled || !hostRef.current) return
          if (!hostHasGoogleButton(hostRef.current)) {
            onBlockedRef.current?.('script')
            onErrorRef.current?.('googleScriptFailed')
          }
        }, RENDER_WATCH_MS)
      })
      .catch(() => {
        if (!cancelled) {
          onBlockedRef.current?.('script')
          onErrorRef.current?.('googleScriptFailed')
        }
      })

    return () => {
      cancelled = true
      if (renderTimer) window.clearTimeout(renderTimer)
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
