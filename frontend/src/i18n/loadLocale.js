import { deepMerge } from './deepMerge'

/** Carga bajo demanda de diccionarios (no van en el bundle inicial salvo es/en). */
export async function loadLocaleDictionary(code) {
  switch (code) {
    case 'es': {
      const [esMod, pagesMod] = await Promise.all([
        import('./locales/es.js'),
        import('./sections/pages-es.js'),
      ])
      return { ...esMod.default, ...pagesMod.pagesEs }
    }
    case 'en': {
      const [enMod, pagesMod] = await Promise.all([
        import('./locales/en.js'),
        import('./sections/pages-en.js'),
      ])
      return { ...enMod.default, ...pagesMod.pagesEn }
    }
    case 'pt': {
      const [loc, pagesMod] = await Promise.all([
        import('./locales/pt.js'),
        import('./sections/pages-pt.js'),
      ])
      return { ...loc.default, ...pagesMod.pagesPt }
    }
    case 'fr': {
      const [loc, pagesMod] = await Promise.all([
        import('./locales/fr.js'),
        import('./sections/pages-fr.js'),
      ])
      return { ...loc.default, ...pagesMod.pagesFr }
    }
    case 'it': {
      const [loc, pagesMod] = await Promise.all([
        import('./locales/it.js'),
        import('./sections/pages-it.js'),
      ])
      return { ...loc.default, ...pagesMod.pagesIt }
    }
    case 'de': {
      const [loc, pagesMod] = await Promise.all([
        import('./locales/de.js'),
        import('./sections/pages-de.js'),
      ])
      return { ...loc.default, ...pagesMod.pagesDe }
    }
    case 'nl': {
      const [loc, pagesMod] = await Promise.all([
        import('./locales/nl.js'),
        import('./sections/pages-nl.js'),
      ])
      return { ...loc.default, ...pagesMod.pagesNl }
    }
    case 'pl': {
      const [loc, pagesMod] = await Promise.all([
        import('./locales/pl.js'),
        import('./sections/pages-pl.js'),
      ])
      return { ...loc.default, ...pagesMod.pagesPl }
    }
    case 'ro': {
      const [loc, pagesMod] = await Promise.all([
        import('./locales/ro.js'),
        import('./sections/pages-ro.js'),
      ])
      return { ...loc.default, ...pagesMod.pagesRo }
    }
    case 'ca': {
      const [loc, pagesMod] = await Promise.all([
        import('./locales/ca.js'),
        import('./sections/pages-ca.js'),
      ])
      return { ...loc.default, ...pagesMod.pagesCa }
    }
    case 'tr': {
      const [loc, pagesMod] = await Promise.all([
        import('./locales/tr.js'),
        import('./sections/pages-tr.js'),
      ])
      return { ...loc.default, ...pagesMod.pagesTr }
    }
    case 'ar':
      return mergePack(() => import('./packs/ar.js'))
    case 'zh':
      return mergePack(() => import('./packs/zh.js'))
    case 'ja':
      return mergePack(() => import('./packs/ja.js'))
    case 'ru':
      return mergePack(() => import('./packs/ru.js'))
    case 'hi':
      return mergePack(() => import('./packs/hi.js'))
    case 'uk':
      return mergePack(() => import('./packs/uk.js'))
    case 'vi':
      return mergePack(() => import('./packs/vi.js'))
    case 'id':
      return mergePack(() => import('./packs/id.js'))
    case 'ko':
      return mergePack(() => import('./packs/ko.js'))
    case 'sv':
      return mergePack(() => import('./packs/sv.js'))
    default:
      return null
  }
}

async function mergePack(importPack) {
  const [enMod, pagesMod, packMod] = await Promise.all([
    import('./locales/en.js'),
    import('./sections/pages-en.js'),
    importPack(),
  ])
  const enDict = { ...enMod.default, ...pagesMod.pagesEn }
  return deepMerge(enDict, packMod.default)
}
