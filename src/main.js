import { TOKEN, TOKEN2AF } from '@/config/constant'
import { registerStore } from '@/store'
import cookies from '@/utils/cookies'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

import ElementPlus, { ElMessageBox } from 'element-plus'
import { useSvgIcon } from './icons'

import './permission'

import 'animate.css'
import './assets/fonts/index.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/index.scss'
import './assets/iconfont/iconfont.css'
import globalEmitter from '@/utils/mitt'
import registerDirective from '@/directive'
import i18n, { setupI18n } from '@/locale'
import { setupElementIcons } from '@/plugins/elementIcons'
import { useTable } from '@/plugins/vxeTable'
import VueHtmlToPaper from 'vue-html-to-paper'
import {getConfig, loadRuntimeConfig} from '@/config'

await loadRuntimeConfig()

// Khởi tạo ứng dụng Vue mà không cần Keycloak
const app = createApp(App)
app.use(VueHtmlToPaper)

app.config.globalProperties.$config = getConfig()

const token = cookies.get(TOKEN)
console.log('token', token)
if (token) {
  app.config.globalProperties.$token = token
}
// Khởi tạo ứng dụng Vue
const initApp = async () => {
  app.use(router)
  useSvgIcon(app)
  registerStore(app)
  registerDirective(app)
  await router.isReady()

  setupI18n(app)
  setupElementIcons(app)
  app.use(globalEmitter)
  app.use(ElementPlus, {
    size: 'small',
    i18n: i18n.global.t,
    locale: cookies.get('lang'),
  })
  app.use(useTable)

  app.mount('#app')
}
initApp()

export { app }
