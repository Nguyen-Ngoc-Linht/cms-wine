import { createPinia } from 'pinia'
import useAppStore from './modules/app'
import useCommonStore from './modules/common'
import useNotifyStore from './modules/notify'
import usePermissionStore from './modules/permission'
import useSettingsStore from './modules/settings'
import useTagsViewStore from './modules/tagsView'
import useUserStore from './modules/users'

const store = createPinia()

export function registerStore(app) {
  app.use(store)
}

export {
  useAppStore,
  useCommonStore,
  useNotifyStore,
  usePermissionStore,
  useSettingsStore,
  useTagsViewStore,
  useUserStore,
}

export default store
