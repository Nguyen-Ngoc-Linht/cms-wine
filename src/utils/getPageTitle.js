import defaultSettings from '@/settings'
import i18n from '@/locale'
const title = defaultSettings.title || 'GSTP - Giám sát thu phí'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${title}`
  }
  return `${title}`
}

export function getRouteName(key) {
  const hasKey = i18n.global.te(`route.${key}`)
  if (hasKey) {
    return i18n.global.t(`route.${key}`)
  }
  return key
}
