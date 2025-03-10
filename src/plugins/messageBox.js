import { showMessage } from '@/utils/showMessage'

export default {
  install(app) {
    app.config.globalProperties.$message = showMessage
  },
}
