import { chromium } from 'playwright'
import { mkdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../screenshots')
const baseURL = process.env.APP_URL || 'http://localhost:5173'

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
  await page.waitForTimeout(400)
  const loginModal = page.locator('.modal.show .modal-content')
  await loginModal.screenshot({ path: path.join(outDir, 'login.png') })
  console.log('saved login.png')

  // Registro tab
  await page.getByRole('button', { name: /Registrarse|Register/i }).first().click()
  await page.waitForTimeout(300)
  await loginModal.screenshot({ path: path.join(outDir, 'registro.png') })
  console.log('saved registro.png')

  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)

  // Consumos
  await page.getByRole('button', { name: /Consumos/i }).first().click()
  await page.waitForTimeout(700)
  await shot(page, 'consumos.png', { fullPage: true })

  // Análisis IA
  await page.getByRole('button', { name: /Análisis IA|Analisis IA/i }).first().click()
  await page.waitForTimeout(700)
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
