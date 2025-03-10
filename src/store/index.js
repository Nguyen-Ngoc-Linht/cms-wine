import { createPinia } from 'pinia'
import useAppStore from './modules/app'
import useRouteUser from '@/store/modules/userRoute'
import useCommonStore from './modules/common'
import useNotifyStore from './modules/notify'
import usePermissionStore from './modules/permission'
import useSettingsStore from './modules/settings'
import useTagsViewStore from './modules/tagsView'
import useUserStore from './modules/users'
import useSearchStore from './modules/search'
import useAdministrativeDepartmentStore from './modules/administrativeDepartment'
import useStatisticalReportStore from '@/store/modules/statistical-report'
import useExplanationSupportStore from '@/store/modules/explanation-support'

const store = createPinia()

export function registerStore(app) {
  app.use(store)
}

export {
  useAppStore,
  useRouteUser,
  useCommonStore,
  useNotifyStore,
  usePermissionStore,
  useSettingsStore,
  useTagsViewStore,
  useUserStore,
  useSearchStore,
  useAdministrativeDepartmentStore,
  useStatisticalReportStore,
  useExplanationSupportStore,
}

export default store
