// see more : https://vue-i18n.intlify.dev/introduction.html
import Cookies from 'js-cookie'
import { createI18n } from 'vue-i18n'
import messages from './getMessage'

const localeData = {
  legacy: false, // composition API
  locale: getLanguage(),
  globalInjection: true, // Global mode, which can be used directly $t
  warnHtmlMessage: false, // disable of the Detected HTML in message
  messages,
}

export const i18n = createI18n(localeData)

export const useI18n = () => {
  if (!i18n) {
    throw new Error('No vue-i18n instance provided.')
  }

  const t = (key, value) => i18n.global.t(key, value)
  return { t }
}

export function setupI18n(app) {
  app.use(i18n)
}

export function getLanguage() {
  const chooseLanguage = Cookies.get('language')

  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'vi'
}

export default i18n
