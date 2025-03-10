// src/composables/useI18n.js
import { inject } from 'vue'

const useI18n = () => {
  const i18n = inject('i18n')

  if (!i18n) {
    throw new Error('No vue-i18n instance provided.')
  }

  const t = key => i18n.global.t(key)
  return { t }
}

export default useI18n
