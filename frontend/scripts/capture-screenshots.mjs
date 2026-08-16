import { chromium } from 'playwright'
import { mkdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../screenshots')
const baseURL = process.env.APP_URL || 'http://localhost:5173'

async function waitForGoogleButton(modal, page, label) {
  const iframe = modal.locator('.google-signin-host iframe')
  try {
    await iframe.waitFor({ state: 'visible', timeout: 20000 })
    await page.waitForTimeout(600)
    return true
  } catch {
    console.warn(
      `[${label}] Botón Google no visible — revisá VITE_GOOGLE_CLIENT_ID o usá APP_URL=https://g9-latam-team-48.vercel.app`,
    )
    await page.waitForTimeout(800)
    return false
  }
}

async function shot(page, name, options = {}) {
  const file = path.join(outDir, name)
  await page.screenshot({
    path: file,
    fullPage: options.fullPage ?? false,
    ...options,
  })
  console.log('saved', name)
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

  await page.goto(baseURL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)

  // Dashboard (incluye resumen fácil + gráficos mock)
  await shot(page, 'dashboard.png', { fullPage: true })

  // Login modal
  await page.getByRole('button', { name: /Iniciar sesión|Entrar/i }).first().click()
  await page.waitForSelector('.modal.show', { timeout: 5000 })
  const loginModal = page.locator('.modal.show .modal-content')
  await waitForGoogleButton(loginModal, page, 'login')
  await loginModal.screenshot({ path: path.join(outDir, 'login.png') })
  console.log('saved login.png')

  // Registro (enlace de texto en el modal, no pestaña)
  await loginModal.getByRole('button', { name: /Registrate|Create account|No tenés cuenta|switch to register/i }).click()
  await page.waitForTimeout(400)
  await waitForGoogleButton(loginModal, page, 'registro')
  await loginModal.screenshot({ path: path.join(outDir, 'registro.png') })
  console.log('saved registro.png')

  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)

  // Consumos
  await page.getByRole('button', { name: /Consumos/i }).first().click()
  await page.waitForTimeout(700)
  await shot(page, 'consumos.png', { fullPage: true })

  // Análisis IA (casa con datos + análisis para mostrar gráfico y tips)
  await page.getByRole('button', { name: /Análisis IA|Analisis IA/i }).first().click()
  await page.waitForTimeout(500)
  await page.locator('#consumoKwh').fill('450')
  await page.locator('#consumoKwhMesAnterior').fill('430')
  await page.locator('#cantidadPersonas').fill('4')
  await page.locator('#cantidadEquipos').fill('12')
  await page.locator('#areaM2').fill('120')
  await page.locator('#horasClimatizacion').fill('6')
  await page.locator('#pctIluminacionLed').fill('65')
  await page.locator('#antiguedadConstruccionAnios').fill('15')
  await page.locator('#antiguedadElectrodomesticosAnios').fill('8')
  await page.getByRole('button', { name: /Analizar consumo|Analyze usage/i }).click()
  await page.waitForTimeout(1200)
  await shot(page, 'analisis-ia.png', { fullPage: true })

  // Recomendaciones
  await page.getByRole('button', { name: /Recomendaciones/i }).first().click()
  await page.waitForTimeout(700)
  await shot(page, 'recomendaciones.png', { fullPage: true })

  await browser.close()
  console.log('done')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
