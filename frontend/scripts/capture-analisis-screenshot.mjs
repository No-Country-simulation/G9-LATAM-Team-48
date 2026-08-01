import { chromium } from 'playwright'
import { mkdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../screenshots')
const baseURL = process.env.APP_URL || 'http://localhost:5173'

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
  await page.waitForTimeout(1000)

  await page.getByRole('button', { name: /Análisis IA|Analisis IA/i }).first().click()
  await page.waitForTimeout(600)

  await page.locator('#tipoInmueble').selectOption('APARTAMENTO')
  await page.locator('#consumoKwh').fill('390')
  await page.locator('#consumoKwhMesAnterior').fill('415')
  await page.locator('#areaM2').fill('59')
  await page.locator('#cantidadPersonas').fill('4')
  await page.locator('#cantidadEquipos').fill('15')
  await page.locator('#horasClimatizacion').fill('0')
  await page.locator('#aislamientoTermico').selectOption('REGULAR')
  await page.locator('#pctIluminacionLed').fill('35')
  await page.locator('#antiguedadConstruccionAnios').fill('10')
  await page.locator('#zona').selectOption('URBANA_INTERIOR')
  await page.locator('#antiguedadElectrodomesticosAnios').fill('5')
  await page.locator('#horasAltoConsumo').fill('11')
  const peakSwitch = page.locator('#usoHorarioPico')
  if (!(await peakSwitch.isChecked())) {
    await peakSwitch.check()
  }

  await page.getByRole('button', { name: /Analizar consumo|Analyze usage/i }).click()
  await page.waitForSelector('text=Resultado IA', { timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(800)
  await page.evaluate(() => window.scrollTo(0, 0))

  const file = path.join(outDir, 'analisis-ia.png')
  await page.screenshot({ path: file, fullPage: true })
  console.log('saved analisis-ia.png')

  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
