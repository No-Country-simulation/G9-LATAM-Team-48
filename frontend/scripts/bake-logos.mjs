import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../public')

const logos = ['logo-energia.png', 'logo-energia-dark.png']

/** Ancho ~2× del logo en navbar mobile (~96px CSS). */
const MOBILE_WIDTH = 192
const DESKTOP_WIDTH = 320

async function bakeOne(fileName) {
  const input = path.join(publicDir, fileName)
  const base = fileName.replace(/\.png$/i, '')

  await sharp(input)
    .resize({ width: MOBILE_WIDTH, withoutEnlargement: true })
    .webp({ quality: 78, effort: 4 })
    .toFile(path.join(publicDir, `${base}-sm.webp`))

  await sharp(input)
    .resize({ width: DESKTOP_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80, effort: 4 })
    .toFile(path.join(publicDir, `${base}.webp`))

  if (fileName === 'logo-energia.png') {
    await sharp(input)
      .resize({ width: 32, height: 32, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, palette: true })
      .toFile(path.join(publicDir, 'favicon.png'))
  }

  console.log('ok', base, '→ sm + desktop webp')
}

await mkdir(publicDir, { recursive: true })
for (const name of logos) {
  await bakeOne(name)
}

console.log('done')
