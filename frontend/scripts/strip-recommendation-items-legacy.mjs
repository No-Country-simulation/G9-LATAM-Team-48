import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = dirname(fileURLToPath(import.meta.url))

function stripItemsBlock(content) {
  const patterns = [
    /\n    items: \{[\s\S]*?\n    \},/g,
    /\n    "items": \{[\s\S]*?\n    \},/g,
  ]
  let out = content
  for (const re of patterns) {
    out = out.replace(re, '')
  }
  return out
}

const targets = [
  join(root, '../src/i18n/sections'),
  join(root, '../src/i18n/packs'),
]

for (const dir of targets) {
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.js')) continue
    const path = join(dir, file)
    const raw = readFileSync(path, 'utf8')
    if (!raw.includes('items') || !raw.includes('recommendations')) continue
    if (!raw.match(/items:\s*\{|"items":\s*\{/)) continue
    const next = stripItemsBlock(raw)
    if (next !== raw) {
      writeFileSync(path, next, 'utf8')
      console.log('stripped', path)
    }
  }
}
