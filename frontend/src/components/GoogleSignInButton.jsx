import { useEffect, useRef } from 'react'
import { loadGoogleIdentityScript, isGoogleSignInHostVisible } from '../utils/googleSignInSupport'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const RENDER_CHECK_MS = [600, 1400, 2800]

function notifyGoogleBlocked(onBlockedRef, onErrorRef) {
  onBlockedRef.current?.('render')
  onErrorRef.current?.('googleScriptFailed')
}

function scheduleRenderChecks(host, cancelledRef, onBlockedRef, onErrorRef) {
  const timers = RENDER_CHECK_MS.map((delay) =>
    window.setTimeout(() => {
      if (cancelledRef.current || !host) return
      if (!isGoogleSignInHostVisible(host)) {
        notifyGoogleBlocked(onBlockedRef, onErrorRef)
      }
    }, delay),
  )
  return () => timers.forEach((id) => window.clearTimeout(id))
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
    const cancelledRef = { current: false }

    let clearRenderChecks = () => {}

    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !hostRef.current || !window.google?.accounts?.id) {
          if (!cancelled) notifyGoogleBlocked(onBlockedRef, onErrorRef)
          return
        }
        const host = hostRef.current
        host.innerHTML = ''
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
        window.google.accounts.id.renderButton(host, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 320,
        })
        clearRenderChecks = scheduleRenderChecks(
          host,
          cancelledRef,
          onBlockedRef,
          onErrorRef,
        )
      })
      .catch(() => {
        if (!cancelled) notifyGoogleBlocked(onBlockedRef, onErrorRef)
      })

    return () => {
      cancelled = true
      cancelledRef.current = true
      clearRenderChecks()
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
