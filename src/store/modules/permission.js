import { asyncRoutes, constantRoutes } from '@/router'
import { defineStore } from 'pinia'

/**
 * Use meta.role to determine whether the current user has permissions
 * @param permissions
 * @param route
 */

function hasPermission(permissions, route) {
  if (route.meta && route.meta.permissions && permissions) {
    return permissions.some(item =>
      route.meta.permissions.some(
        o => o === item || (item && (item === o || item.startsWith(o + '/')))
      )
    )
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables via recursion
 * @param routes asyncRoutes
 * @param permissions
 */
export function filterAsyncRoutes(routes, permissions) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissions)
      }
      res.push(tmp)
    }
  })
  return res
}

const usePermissionStore = defineStore({
  id: 'permission',
  state: () => {
    return {
      routes: [],
      addRoutes: [],
      directivePermission: [],
      roleData: {
        canRead: false,
        canDetail: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
        canExport: false,
        canApprove: false,
        canConfirm: false,
        canExplain: false,
        canNotify: false,
      },
    }
  },
  actions: {
    SET_ROUTES(isAdmin) {
      return new Promise(resolve => {
        const accessedRoutes = asyncRoutes
        // if (isAdmin) {
        //   accessedRoutes = asyncRoutes || []
        // } else {
        //   accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions)
        // }
        // accessedRoutes[0].path = '/'
        this.addRoutes = accessedRoutes
        this.routes = constantRoutes.concat(accessedRoutes)
        resolve(accessedRoutes)
      })
    },
    SET_DIRECTIVE_ROLE(permissions) {
      this.directivePermission = permissions
    },
    SET_ROLE_DATA(roles) {
      this.roleData = roles
    },
  },
})

export default usePermissionStore
