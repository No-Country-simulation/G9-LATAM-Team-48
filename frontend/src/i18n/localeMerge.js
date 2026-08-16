import { deepMerge } from './deepMerge'

let enPagesBasePromise = null

export function loadEnPagesBase() {
  if (!enPagesBasePromise) {
    enPagesBasePromise = Promise.all([
      import('./locales/en.js'),
      import('./sections/pages-en.js'),
    ]).then(([enMod, pagesEnMod]) => ({
      ...enMod.default,
      ...pagesEnMod.pagesEn,
    }))
  }
  return enPagesBasePromise
}

export function mergeLocaleLayers(baseEn, localeMod, pagesSlice, patch) {
  const overlay = { ...localeMod.default, ...pagesSlice }
  return deepMerge(deepMerge(baseEn, overlay), patch ?? {})
}
