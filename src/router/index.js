import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/layout/index.vue'
import home from './modules/home'
import notify from './modules/notify'
import administration from './modules/administration'
import monitoring from './modules/monitoring'
import dashboard from './modules/dashboard'
import explanationSupport from './modules/explanation-support'
import reconciliation from './modules/reconciliation'
import collection from './modules/collection'
import statisticalReport from './modules/statistical-report'

export const constantRoutes = [
  {
    path: '/profile',
    component: Layout,
    meta: {
      hidden: true,
      static: true,
    },
    children: [
      {
        path: '',
        name: 'profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          hidden: true,
          title: 'profile',
          static: true,
        },
      },
    ],
  },
  {
    path: '/verify',
    name: 'verifyLogin',
    component: () => import('@/views/verify/index.vue'),
    meta: {
      hidden: true,
      static: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/login.vue'),
    meta: {
      hidden: true,
      title: '404',
      noAuth: true,
      static: true,
    },
  },
  {
    path: '/404',
    name: 'Error404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      hidden: true,
      title: '404',
      noAuth: true,
      static: true,
    },
  },
  {
    path: '/401',
    name: 'Error401',
    component: () => import('@/views/error/401.vue'),
    meta: {
      hidden: true,
      title: '401',
      noAuth: true,
      static: true,
    },
  },
  {
    path: '/500',
    name: 'Error500',
    component: () => import('@/views/error/500.vue'),
    meta: {
      hidden: true,
      title: '500',
      noAuth: true,
      static: true,
    },
  },
]
export const asyncRoutes = [
  home,
  collection,
  reconciliation,
  monitoring,
  statisticalReport,
  dashboard,
  administration,
  notify,
  explanationSupport,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Redirect404',
    meta: {
      title: '404',
      hidden: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes.concat(asyncRoutes),
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export function resetRouter() {
  const WHITE_NAME_LIST = ['Login']
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export default router
