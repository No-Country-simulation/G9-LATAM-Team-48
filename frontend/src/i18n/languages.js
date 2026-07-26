/**
 * Catálogo de idiomas de la app.
 * `fullUi: true` → tiene diccionario completo.
 * `fullUi: false` → la UI cae a inglés (nombres y selección sí funcionan).
 */
export const APP_LANGUAGES = [
  { code: 'es', label: 'ES', name: 'Español', fullUi: true },
  { code: 'en', label: 'EN', name: 'English', fullUi: true },
  { code: 'pt', label: 'PT', name: 'Português', fullUi: true },
  { code: 'fr', label: 'FR', name: 'Français', fullUi: true },
  { code: 'it', label: 'IT', name: 'Italiano', fullUi: true },
  { code: 'de', label: 'DE', name: 'Deutsch', fullUi: true },
  { code: 'nl', label: 'NL', name: 'Nederlands', fullUi: true },
  { code: 'pl', label: 'PL', name: 'Polski', fullUi: true },
  { code: 'ro', label: 'RO', name: 'Română', fullUi: true },
  { code: 'ca', label: 'CA', name: 'Català', fullUi: true },
  { code: 'tr', label: 'TR', name: 'Türkçe', fullUi: true },

  { code: 'ar', label: 'AR', name: 'العربية', fullUi: false },
  { code: 'zh', label: 'ZH', name: '中文', fullUi: false },
  { code: 'ja', label: 'JA', name: '日本語', fullUi: false },
  { code: 'ko', label: 'KO', name: '한국어', fullUi: false },
  { code: 'ru', label: 'RU', name: 'Русский', fullUi: false },
  { code: 'hi', label: 'HI', name: 'हिन्दी', fullUi: false },
  { code: 'bn', label: 'BN', name: 'বাংলা', fullUi: false },
  { code: 'ur', label: 'UR', name: 'اردو', fullUi: false },
  { code: 'fa', label: 'FA', name: 'فارسی', fullUi: false },
  { code: 'he', label: 'HE', name: 'עברית', fullUi: false },
  { code: 'th', label: 'TH', name: 'ไทย', fullUi: false },
  { code: 'vi', label: 'VI', name: 'Tiếng Việt', fullUi: false },
  { code: 'id', label: 'ID', name: 'Bahasa Indonesia', fullUi: false },
  { code: 'ms', label: 'MS', name: 'Bahasa Melayu', fullUi: false },
  { code: 'tl', label: 'TL', name: 'Filipino', fullUi: false },
  { code: 'sw', label: 'SW', name: 'Kiswahili', fullUi: false },
  { code: 'am', label: 'AM', name: 'አማርኛ', fullUi: false },
  { code: 'ha', label: 'HA', name: 'Hausa', fullUi: false },
  { code: 'yo', label: 'YO', name: 'Yorùbá', fullUi: false },
  { code: 'ig', label: 'IG', name: 'Igbo', fullUi: false },
  { code: 'zu', label: 'ZU', name: 'isiZulu', fullUi: false },
  { code: 'af', label: 'AF', name: 'Afrikaans', fullUi: false },
  { code: 'uk', label: 'UK', name: 'Українська', fullUi: false },
  { code: 'cs', label: 'CS', name: 'Čeština', fullUi: false },
  { code: 'sk', label: 'SK', name: 'Slovenčina', fullUi: false },
  { code: 'hu', label: 'HU', name: 'Magyar', fullUi: false },
  { code: 'bg', label: 'BG', name: 'Български', fullUi: false },
  { code: 'hr', label: 'HR', name: 'Hrvatski', fullUi: false },
  { code: 'sr', label: 'SR', name: 'Српски', fullUi: false },
  { code: 'sl', label: 'SL', name: 'Slovenščina', fullUi: false },
  { code: 'el', label: 'EL', name: 'Ελληνικά', fullUi: false },
  { code: 'sv', label: 'SV', name: 'Svenska', fullUi: false },
  { code: 'no', label: 'NO', name: 'Norsk', fullUi: false },
  { code: 'da', label: 'DA', name: 'Dansk', fullUi: false },
  { code: 'fi', label: 'FI', name: 'Suomi', fullUi: false },
  { code: 'et', label: 'ET', name: 'Eesti', fullUi: false },
  { code: 'lv', label: 'LV', name: 'Latviešu', fullUi: false },
  { code: 'lt', label: 'LT', name: 'Lietuvių', fullUi: false },
  { code: 'ga', label: 'GA', name: 'Gaeilge', fullUi: false },
  { code: 'is', label: 'IS', name: 'Íslenska', fullUi: false },
  { code: 'sq', label: 'SQ', name: 'Shqip', fullUi: false },
  { code: 'mk', label: 'MK', name: 'Македонски', fullUi: false },
  { code: 'ka', label: 'KA', name: 'ქართული', fullUi: false },
  { code: 'hy', label: 'HY', name: 'Հայերեն', fullUi: false },
  { code: 'az', label: 'AZ', name: 'Azərbaycan', fullUi: false },
  { code: 'kk', label: 'KK', name: 'Қазақша', fullUi: false },
  { code: 'uz', label: 'UZ', name: 'Oʻzbekcha', fullUi: false },
  { code: 'ky', label: 'KY', name: 'Кыргызча', fullUi: false },
  { code: 'tk', label: 'TK', name: 'Türkmençe', fullUi: false },
  { code: 'mn', label: 'MN', name: 'Монгол', fullUi: false },
  { code: 'ne', label: 'NE', name: 'नेपाली', fullUi: false },
  { code: 'si', label: 'SI', name: 'සිංහල', fullUi: false },
  { code: 'my', label: 'MY', name: 'မြန်မာ', fullUi: false },
  { code: 'km', label: 'KM', name: 'ខ្មែរ', fullUi: false },
  { code: 'lo', label: 'LO', name: 'ລາວ', fullUi: false },
]

export const LOCALES = APP_LANGUAGES.map(({ code, label }) => ({ code, label }))

export const LANGUAGE_BY_CODE = Object.fromEntries(
  APP_LANGUAGES.map((item) => [item.code, item]),
)

export function getLanguageMeta(code) {
  return (
    LANGUAGE_BY_CODE[code] || {
      code,
      label: String(code || '').toUpperCase(),
      name: String(code || '').toUpperCase(),
      fullUi: false,
    }
  )
}
