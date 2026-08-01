import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../public')

const logos = [
  { name: 'logo-energia.png', width: 384 },
  { name: 'logo-energia-dark.png', width: 384 },
]

async function bakeOne(fileName, width) {
  const input = path.join(publicDir, fileName)
  const base = fileName.replace(/\.png$/i, '')
  const webpOut = path.join(publicDir, `${base}.webp`)

  await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(webpOut)

  await sharp(input)
    .resize({ width: 32, height: 32, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(publicDir, 'favicon.png'))

  console.log('ok', base, '→ webp + favicon')
}

await mkdir(publicDir, { recursive: true })
for (const item of logos) {
  await bakeOne(item.name, item.width)
}

console.log('done')
