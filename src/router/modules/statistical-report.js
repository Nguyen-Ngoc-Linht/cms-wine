import Layout from '@/layout/index.vue'
import Empty from '@/layout/empty.vue'

export default {
  path: '/statistical-report',
  component: Layout,
  meta: {
    title: 'statisticalReport',
    icon: 'item-menu-statistical-report',
    noCache: false,
    root: true,
    permissions: ['/statistical-report'],
  },
  children: [
    {
      path: 'different-error',
      name: 'different-error',
      component: () => import('@/views/statistical-report/different/index.vue'),
      meta: {
        title: 'differentError',
        noCache: true,
        permissions: ['/statistical-report/different-error'],
      },
    },
    {
      path: 'traffic-revenue',
      name: 'traffic-revenue',
      component: () => import('@/views/statistical-report/traffic-revenue/index.vue'),
      meta: {
        title: 'revenueFlow',
        noCache: true,
        permissions: ['/statistical-report/traffic-revenue'],
      },
    },
    {
      path: 'traffic-revenue/add',
      name: 'traffic-revenue/add',
      component: () => import('@/views/statistical-report/traffic-revenue/add.vue'),
      meta: {
        title: 'revenueFlow',
        hidden: true,
        noCache: true,
        permissions: ['/statistical-report/traffic-revenue'],
        activeMenu: '/statistical-report/traffic-revenue',
      },
    },
    {
      path: 'traffic-revenue/edit/:id',
      name: 'traffic-revenue-edit',
      component: () => import('@/views/statistical-report/traffic-revenue/edit.vue'),
      meta: {
        title: 'revenueFlow',
        hidden: true,
        noCache: true,
        permissions: ['/statistical-report/traffic-revenue'],
        activeMenu: '/statistical-report/traffic-revenue',
      },
    },
    {
      path: 'traffic-revenue/view/:id',
      name: 'traffic-revenue-view',
      component: () => import('@/views/statistical-report/traffic-revenue/view.vue'),
      meta: {
        title: 'revenueFlow',
        hidden: true,
        noCache: true,
        permissions: ['/statistical-report/traffic-revenue'],
        activeMenu: '/statistical-report/traffic-revenue',
      },
    },
    {
      path: 'KPI-detail',
      name: 'KPI-detail',
      component: () => import('@/views/statistical-report/KPI-detail/index.vue'),
      meta: {
        title: 'detailKPIStatistics',
        noCache: true,
        permissions: ['/statistical-report/KPI-detail'],
      },
    },
    {
      path: 'KPI-detail/add',
      name: 'KPI-detail-add',
      component: () => import('@/views/statistical-report/KPI-detail/add.vue'),
      meta: {
        title: 'detailKPIStatistics',
        noCache: true,
        hidden: true,
        activeMenu: '/statistical-report/KPI-detail',
        permissions: ['/statistical-report/KPI-detail'],
      },
    },
    {
      path: 'KPI-detail/view/:id',
      name: 'KPI-detail-view',
      component: () => import('@/views/statistical-report/KPI-detail/view.vue'),
      meta: {
        title: 'detailKPIStatistics',
        noCache: true,
        hidden: true,
        activeMenu: '/statistical-report/KPI-detail',
        permissions: ['/statistical-report/KPI-detail'],
      },
    },
    {
      path: 'traffic-revenue-management',
      name: 'traffic-revenue-management',
      component: () => import('@/views/statistical-report/traffic-revenue-management/index.vue'),
      meta: {
        title: 'trafficRevenueManagement',
        noCache: true,
        permissions: ['/statistical-report/traffic-revenue-management'],
      },
    },
    {
      path: 'traffic-revenue-management/add',
      name: 'traffic-revenue-management-add',
      component: () => import('@/views/statistical-report/traffic-revenue-management/add.vue'),
      meta: {
        title: 'trafficRevenueManagement',
        noCache: true,
        hidden: true,
        permissions: ['/statistical-report/traffic-revenue-management'],
        activeMenu: '/statistical-report/traffic-revenue-management',
      },
    },
    {
      path: 'traffic-revenue-management/edit/:id',
      name: 'traffic-revenue-management-edit',
      component: () => import('@/views/statistical-report/traffic-revenue-management/edit.vue'),
      meta: {
        title: 'trafficRevenueManagement',
        noCache: true,
        hidden: true,
        permissions: ['/statistical-report/traffic-revenue-management'],
        activeMenu: '/statistical-report/traffic-revenue-management',
      },
    },
    {
      path: 'traffic-revenue-management/view/:id',
      name: 'traffic-revenue-management-view',
      component: () => import('@/views/statistical-report/traffic-revenue-management/view.vue'),
      meta: {
        title: 'trafficRevenueManagement',
        noCache: true,
        hidden: true,
        permissions: ['/statistical-report/traffic-revenue-management'],
        activeMenu: '/statistical-report/traffic-revenue-management',
      },
    },
  ],
}
