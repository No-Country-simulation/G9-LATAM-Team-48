import { deepMerge } from './deepMerge'
import { loadEnPagesBase, mergeLocaleLayers } from './localeMerge'
import { getUiExtendedPatch } from './sections/uiExtended.js'

async function loadRegional(code, localeImport, pagesImport, pagesKey) {
  const [baseEn, locMod, pagesMod] = await Promise.all([
    loadEnPagesBase(),
    localeImport(),
    pagesImport(),
  ])
  return mergeLocaleLayers(baseEn, locMod, pagesMod[pagesKey], getUiExtendedPatch(code))
}

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
      return loadEnPagesBase()
    }
    case 'pt':
      return loadRegional(
        'pt',
        () => import('./locales/pt.js'),
        () => import('./sections/pages-pt.js'),
        'pagesPt',
      )
    case 'fr':
      return loadRegional(
        'fr',
        () => import('./locales/fr.js'),
        () => import('./sections/pages-fr.js'),
        'pagesFr',
      )
    case 'it':
      return loadRegional(
        'it',
        () => import('./locales/it.js'),
        () => import('./sections/pages-it.js'),
        'pagesIt',
      )
    case 'de':
      return loadRegional(
        'de',
        () => import('./locales/de.js'),
        () => import('./sections/pages-de.js'),
        'pagesDe',
      )
    case 'nl':
      return loadRegional(
        'nl',
        () => import('./locales/nl.js'),
        () => import('./sections/pages-nl.js'),
        'pagesNl',
      )
    case 'pl':
      return loadRegional(
        'pl',
        () => import('./locales/pl.js'),
        () => import('./sections/pages-pl.js'),
        'pagesPl',
      )
    case 'ro':
      return loadRegional(
        'ro',
        () => import('./locales/ro.js'),
        () => import('./sections/pages-ro.js'),
        'pagesRo',
      )
    case 'ca':
      return loadRegional(
        'ca',
        () => import('./locales/ca.js'),
        () => import('./sections/pages-ca.js'),
        'pagesCa',
      )
    case 'tr':
      return loadRegional(
        'tr',
        () => import('./locales/tr.js'),
        () => import('./sections/pages-tr.js'),
        'pagesTr',
      )
    case 'ar':
      return mergePack('ar', () => import('./packs/ar.js'))
    case 'zh':
      return mergePack('zh', () => import('./packs/zh.js'))
    case 'ja':
      return mergePack('ja', () => import('./packs/ja.js'))
    case 'ru':
      return mergePack('ru', () => import('./packs/ru.js'))
    case 'hi':
      return mergePack('hi', () => import('./packs/hi.js'))
    case 'uk':
      return mergePack('uk', () => import('./packs/uk.js'))
    case 'vi':
      return mergePack('vi', () => import('./packs/vi.js'))
    case 'id':
      return mergePack('id', () => import('./packs/id.js'))
    case 'ko':
      return mergePack('ko', () => import('./packs/ko.js'))
    case 'sv':
      return mergePack('sv', () => import('./packs/sv.js'))
    default:
      return null
  }
}

async function mergePack(code, importPack) {
  const [baseEn, packMod] = await Promise.all([loadEnPagesBase(), importPack()])
  return deepMerge(deepMerge(baseEn, packMod.default), getUiExtendedPatch(code))
}
