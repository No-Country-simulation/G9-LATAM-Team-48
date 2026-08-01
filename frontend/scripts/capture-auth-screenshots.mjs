import { chromium } from 'playwright'
import { mkdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../screenshots')
const baseURL = process.env.APP_URL || 'http://localhost:5173'

/** Espera a que GIS pinte el iframe del botón dentro del modal. */
async function waitForGoogleButton(modal, page, label) {
  const iframe = modal.locator('.google-signin-host iframe')
  try {
    await iframe.waitFor({ state: 'visible', timeout: 20000 })
    await page.waitForTimeout(600)
    return true
  } catch {
    console.warn(
      `[${label}] No se vio el botón de Google en 20s. Usá APP_URL de Vercel o dev con VITE_GOOGLE_CLIENT_ID y reiniciá Vite.`,
    )
    await page.waitForTimeout(800)
    return false
  }
}

async function captureAuthModals(page) {
  await page.getByRole('button', { name: /Iniciar sesión|Entrar|Log in|Sign in/i }).first().click()
  await page.waitForSelector('.modal.show', { timeout: 10000 })
  const loginModal = page.locator('.modal.show .modal-content')

  await waitForGoogleButton(loginModal, page, 'login')
  await page.waitForTimeout(400)
  await loginModal.screenshot({ path: path.join(outDir, 'login.png') })
  console.log('saved login.png (aviso corto)')

  const googleHost = loginModal.locator('.google-signin-host')
  if (await googleHost.count()) {
    await googleHost.click({ timeout: 5000 })
    await page.waitForTimeout(3500)
  }
  await loginModal.screenshot({ path: path.join(outDir, 'login-bloqueador.png') })
  console.log('saved login-bloqueador.png (aviso ampliado tras clic sin popup)')

  await page.getByRole('button', { name: /Registrarse|Register|Sign up|Registrate|Create account|No tenés cuenta/i }).first().click()
  await page.waitForTimeout(400)
  await waitForGoogleButton(loginModal, page, 'registro')
  await loginModal.screenshot({ path: path.join(outDir, 'registro.png') })
  console.log('saved registro.png')
}

async function main() {
  await mkdir(outDir, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  })

  await page.addInitScript(() => {
    localStorage.setItem('theme', 'dark')
    localStorage.setItem('locale', 'es')
  })

  console.log('APP_URL', baseURL)
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1200)

  await captureAuthModals(page)

  await browser.close()
  console.log('done (login + registro)')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
