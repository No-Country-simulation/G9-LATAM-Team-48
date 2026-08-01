export const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

/**
 * Heurística común: muchos bloqueadores ocultan elementos con clases tipo "ad".
 * Puede dar falso positivo (modo estricto del navegador); el fallo del script GIS confirma.
 */
export function probeLikelyAdBlock() {
  if (typeof document === 'undefined') return Promise.resolve(false)

  return new Promise((resolve) => {
    const bait = document.createElement('div')
    bait.setAttribute('aria-hidden', 'true')
    bait.className = 'adsbox ad-banner ad-placement doubleclick'
    bait.style.cssText =
      'position:absolute;left:-9999px;top:-9999px;height:10px;width:10px;pointer-events:none;'
    bait.textContent = ' '
    document.body.appendChild(bait)

    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        let hidden = false
        try {
          const style = window.getComputedStyle(bait)
          hidden =
            bait.offsetParent === null ||
            bait.offsetHeight === 0 ||
            style.display === 'none' ||
            style.visibility === 'hidden'
        } catch {
          hidden = false
        }
        bait.remove()
        resolve(hidden)
      }, 50)
    })
  })
}

/** true si el script GIS no carga (típico con uBlock / Privacy Badger). */
export function probeGoogleIdentityScriptBlocked() {
  if (typeof document === 'undefined') return Promise.resolve(false)
  if (window.google?.accounts?.id) return Promise.resolve(false)

  const existing = document.querySelector(`script[src^="${GIS_SCRIPT_SRC}"]`)
  if (existing && window.google?.accounts?.id) return Promise.resolve(false)

  return new Promise((resolve) => {
    let settled = false
    const finish = (blocked) => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      probe.remove()
      resolve(blocked)
    }

    const probe = document.createElement('script')
    probe.async = true
    probe.src = `${GIS_SCRIPT_SRC}?probe=${Date.now()}`
    probe.onload = () => finish(!window.google?.accounts?.id)
    probe.onerror = () => finish(true)

    const timer = window.setTimeout(() => finish(true), 3500)
    document.head.appendChild(probe)
  })
}

export async function probeGoogleSignInEnvironment() {
  const [adBlock, scriptBlocked] = await Promise.all([
    probeLikelyAdBlock(),
    probeGoogleIdentityScriptBlocked(),
  ])
  return adBlock || scriptBlocked
}

export function loadGoogleIdentityScript() {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (window.google?.accounts?.id) return Promise.resolve(true)

  const existing = document.querySelector(`script[src="${GIS_SCRIPT_SRC}"]`)
  if (existing) {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) {
        resolve(true)
        return
      }
      const onLoad = () => {
        if (window.google?.accounts?.id) resolve(true)
        else reject(new Error('googleScriptFailed'))
      }
      existing.addEventListener('load', onLoad, { once: true })
      existing.addEventListener(
        'error',
        () => reject(new Error('googleScriptFailed')),
        { once: true },
      )
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = GIS_SCRIPT_SRC
    script.async = true
    script.onload = () => {
      if (window.google?.accounts?.id) resolve(true)
      else reject(new Error('googleScriptFailed'))
    }
    script.onerror = () => reject(new Error('googleScriptFailed'))
    document.head.appendChild(script)
  })
}
