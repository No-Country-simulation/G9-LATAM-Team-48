export const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

function isNodeHiddenByBlocker(node) {
  if (!node) return true
  try {
    const style = window.getComputedStyle(node)
    if (
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      Number(style.opacity) === 0
    ) {
      return true
    }
    const rect = node.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return true
    if (node.offsetHeight === 0 || node.offsetWidth === 0) return true
    return node.offsetParent === null && style.position !== 'fixed'
  } catch {
    return false
  }
}

/**
 * Heurística: uBlock, AdBlock, AdGuard suelen ocultar cebos con ids/clases de anuncios.
 */
export function probeLikelyAdBlock() {
  if (typeof document === 'undefined') return Promise.resolve(false)

  return new Promise((resolve) => {
    const nodes = []
    const specs = [
      { tag: 'div', id: 'google_ads', className: 'adsbox ad-banner ad-placement' },
      { tag: 'div', id: 'ad_container', className: 'advertisement ad-wrap' },
      { tag: 'ins', id: 'AdHeader', className: 'Adsbygoogle ad-zone' },
    ]

    for (const spec of specs) {
      const node = document.createElement(spec.tag)
      node.id = spec.id
      node.className = spec.className
      node.setAttribute('aria-hidden', 'true')
      node.style.cssText =
        'position:absolute;left:-9999px;top:-9999px;height:12px;width:12px;pointer-events:none;'
      node.textContent = ' '
      document.body.appendChild(node)
      nodes.push(node)
    }

    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        const baitBlocked = nodes.some(isNodeHiddenByBlocker)
        nodes.forEach((node) => node.remove())
        if (baitBlocked) {
          resolve(true)
          return
        }

        const img = document.createElement('img')
        img.alt = ''
        img.setAttribute('aria-hidden', 'true')
        img.style.cssText =
          'position:absolute;width:1px;height:1px;left:-9999px;pointer-events:none;'
        const finish = (blocked) => {
          img.remove()
          resolve(blocked)
        }
        img.onload = () => finish(false)
        img.onerror = () => finish(true)
        img.src =
          'https://pagead2.googlesyndication.com/pagead/id?probe=energia&ts=' +
          Date.now()
        window.setTimeout(() => finish(baitBlocked), 1200)
        document.body.appendChild(img)
      }, 80)
    })
  })
}

/** true si el iframe/botón GIS no es visible (común con AdBlock sobre el iframe). */
export function isGoogleSignInHostVisible(host) {
  if (!host) return false
  const iframe = host.querySelector('iframe')
  if (iframe) {
    const rect = iframe.getBoundingClientRect()
    return (
      rect.width >= 120 &&
      rect.height >= 32 &&
      !isNodeHiddenByBlocker(iframe)
    )
  }
  const control = host.querySelector('[role="button"], div[tabindex="0"]')
  if (control) {
    const rect = control.getBoundingClientRect()
    return rect.width >= 120 && rect.height >= 32 && !isNodeHiddenByBlocker(control)
  }
  return false
}

/** true si el script GIS no carga (típico con uBlock / Privacy Badger). */
export function probeGoogleIdentityScriptBlocked() {
  if (typeof document === 'undefined') return Promise.resolve(false)
  if (window.google?.accounts?.id) return Promise.resolve(false)

  const existing = document.querySelector(`script[src^="${GIS_SCRIPT_SRC}"]`)
  if (existing) {
    if (window.google?.accounts?.id) return Promise.resolve(false)
    return new Promise((resolve) => {
      let settled = false
      const done = (blocked) => {
        if (settled) return
        settled = true
        window.clearTimeout(timer)
        resolve(blocked)
      }
      existing.addEventListener('load', () => done(!window.google?.accounts?.id), {
        once: true,
      })
      existing.addEventListener('error', () => done(true), { once: true })
      const timer = window.setTimeout(() => done(false), 2500)
    })
  }

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

    const timer = window.setTimeout(() => finish(false), 2500)
    document.head.appendChild(probe)
  })
}

export async function probeGoogleSignInEnvironment() {
  if (await probeLikelyAdBlock()) return true
  return probeGoogleIdentityScriptBlocked()
}

export const GOOGLE_CLICK_WATCH_MS = 3200

export function isLikelyGoogleAuthPopupUrl(url) {
  const u = String(url || '').toLowerCase()
  return (
    u.includes('accounts.google.com') ||
    u.includes('google.com/o/oauth') ||
    u.includes('google.com/signin')
  )
}

export function isGooglePopupBlockedLogMessage(text) {
  const m = String(text || '').toLowerCase()
  return (
    m.includes('failed to open popup') ||
    m.includes('maybe blocked by the browser') ||
    (m.includes('gsi_logger') && m.includes('blocked'))
  )
}

export function installGoogleSignInConsoleProbe(onPopupBlocked) {
  const inspect = (args) => {
    try {
      const joined = args.map((value) => String(value)).join(' ')
      if (isGooglePopupBlockedLogMessage(joined)) onPopupBlocked()
    } catch {
      /* ignore */
    }
  }
  const nativeError = console.error.bind(console)
  const nativeWarn = console.warn.bind(console)
  console.error = (...args) => {
    inspect(args)
    nativeError(...args)
  }
  console.warn = (...args) => {
    inspect(args)
    nativeWarn(...args)
  }
  return () => {
    console.error = nativeError
    console.warn = nativeWarn
  }
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
