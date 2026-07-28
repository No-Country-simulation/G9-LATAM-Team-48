import { createContext, useContext, useEffect, useState } from 'react'
import { detectLocale, LOCALES, translate } from '../i18n'

const LocaleContext = createContext()

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(detectLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = (code) => {
    if (!LOCALES.some((item) => item.code === code)) return
    setLocaleState(code)
    localStorage.setItem('locale', code)
  }

  const t = (key, fallback) => translate(locale, key, fallback)

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, locales: LOCALES }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
