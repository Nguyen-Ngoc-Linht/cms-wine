import { TOKEN, TOKEN2AF } from '@/config/constant'
import i18n from '@/locale'
import cookies from '@/utils/cookies'
import { useAppStore, usePermissionStore, useUserStore, useRouteUser } from '@/store'
import getPageTitle from '@/utils/getPageTitle'
import NProgress from '@/utils/progress'
import { getConfig } from '@/config'
import router from './router' // Import router trực tiếp

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const token = cookies.get(TOKEN)
  const env = getConfig()

  if (token && to.path === '/login') {
    const userStore = useUserStore()
    const appStore = useAppStore()
    const userRouteStore = useRouteUser()
    const permissionStore = usePermissionStore()
    const tokenIsVerify = cookies.get(TOKEN2AF)
    const lang = cookies.get('language') || 'vi'

    if (!appStore.lang) {
      appStore.SET_LANG(lang)
      i18n.global.locale = lang
    }

    if (!userStore.token) {
      try {
        await userStore.LOGIN() // Đợi login hoàn tất
        userStore.SET_TOKEN(token)
        await userStore.GET_USER_INFO()

        const { isAdmin } = await userStore.GET_USER_ROLE()
        // const { permissions } = await userStore.GET_USER_ROLE_MENU()
        const accessRoutes = await permissionStore.SET_ROUTES(isAdmin)
        await userRouteStore.GET_LIST_ROUTES(userStore.uuid, true)

        router.getRoutes().forEach(route => {
          if (route.name && !route.meta?.static) {
            router.removeRoute(route.name)
          }
        })

        accessRoutes.forEach(route => router.addRoute(route))

        if (isAdmin && to.name !== 'verifyLogin') {
          cookies.set('redirect', to.fullPath)
          return next({ name: 'verifyLogin', replace: true })
        }

        const firstRoute =
          accessRoutes[0]?.children?.[0]?.children?.[0] ||
          accessRoutes[0]?.children?.[0] ||
          accessRoutes[0]

        if (firstRoute?.name) {
          document.title = getPageTitle(firstRoute.meta?.title)
          return next({ name: firstRoute.name, replace: true })
        }
      } catch (error) {
        await userStore.RESET_INFO()
        return next(env.VITE_APP_KEY_CLOAK_BASE || '/login')
      }
    } else {
      const accessRoutes = permissionStore.addRoutes
      if (to.path === '/' && to.name !== 'home') {
        const firstRoute =
          accessRoutes[0]?.children?.[0]?.children?.[0] ||
          accessRoutes[0]?.children?.[0] ||
          accessRoutes[0]

        if (firstRoute?.name) {
          return next({ name: firstRoute.name })
        }
      }
    }

    return next() // Đảm bảo luôn gọi next()
  }

  if (!token && to.path !== '/login') {
    return next('/login')
  }

  return next()
})

router.afterEach(() => {
  NProgress.done()
})
