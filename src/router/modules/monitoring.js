import Layout from '@/layout/index.vue'

export default {
  path: '/monitoring',
  name: 'monitoring',
  component: Layout,
  meta: {
    title: 'monitor',
    icon: 'el-monitoring',
    noCache: false,
    permissions: ['/monitoring'],
  },
  children: [
    {
      path: 'toll',
      name: 'toll',
      // component: () => import('@/views/device/index.vue'),
      meta: {
        title: 'tollMonitoring',
        noCache: false,
        permissions: ['/monitoring/toll'],
      },
      children: [
        {
          path: 'toll-KPI',
          name: 'toll-KPI',
          component: () => import('@/views/monitoring/toll/toll-KPI/index.vue'),
          meta: {
            title: 'tollKPI',
            noCache: false,
            permissions: ['/monitoring/toll/toll-KPI'],
          },
        },
        {
          path: 'config',
          name: 'config',
          component: () => import('@/views/monitoring/toll/config/index.vue'),
          meta: {
            title: 'monitorConfig',
            noCache: false,
            permissions: ['/monitoring/toll/config'],
          },
        },
        {
          path: 'abnormal-transaction-status',
          name: 'abnormal-transaction-status',
          component: () =>
            import('@/views/monitoring/toll/abnormal-transaction-processing-status/index.vue'),
          meta: {
            title: 'abnormalTransaction',
            noCache: false,
            permissions: ['/monitoring/toll/abnormal-transaction-status'],
          },
        },
        {
          path: 'free-car-deals',
          name: 'free-car-deals',
          component: () => import('@/views/monitoring/toll/free-car-deals/index.vue'),
          meta: {
            title: 'freeCarTransaction',
            noCache: false,
            permissions: ['/monitoring/toll/free-car-deals'],
          },
        },
        {
          path: 'vehicle-type45',
          name: 'vehicle-type45',
          component: () => import('@/views/monitoring/toll/transaction-vehicle-type45/index.vue'),
          meta: {
            title: 'vehicleTransaction45',
            noCache: false,
            permissions: ['/monitoring/toll/vehicle-type45'],
          },
        },
        {
          path: 'sk-abnormal-warning',
          name: 'sk-abnormal-warning',
          component: () => import('@/views/monitoring/toll/sk-abnormal-warning/index.vue'),
          meta: {
            title: 'warningOfUnusualEvents',
            noCache: false,
            permissions: ['/monitoring/toll/sk-abnormal-warning'],
          },
        },
        {
          path: 'config-abnormal-warning',
          name: 'config-abnormal-warning',
          component: () => import('@/views/monitoring/toll/config-warning/index.vue'),
          meta: {
            title: 'configWarning',
            noCache: false,
            permissions: [],
          },
        },
        {
          path: 'transaction-all',
          name: 'transaction-all',
          component: () => import('@/views/monitoring/toll/search-all/index.vue'),
          meta: {
            title: 'searchAll',
            noCache: false,
            permissions: ['/monitoring/toll/transaction-all'],
          },
        },
      ],
    },
    {
      path: 'error-handling',
      name: 'error-handling',
      component: () => import('@/views/monitoring/error-handling/index.vue'),
      meta: {
        title: 'errorHandlingMonitoring',
        noCache: false,
        permissions: ['/monitoring/error-handling'],
      },
    },
    {
      path: 'error-handling-view/:id?',
      name: 'error-handling-view',
      component: () => import('@/views/monitoring/error-handling/viewEvent.vue'),
      meta: {
        title: 'errorHandlingMonitoring',
        hidden: true,
        noCache: true,
        permissions: ['/monitoring/error-handling'],
        activeMenu: '/monitoring/error-handling',
      },
    },
    {
      path: 'event/:id',
      name: 'event',
      component: () => import('@/views/monitoring/error-handling/showEvent.vue'),
      meta: {
        title: 'errorHandlingMonitoring',
        hidden: true,
        noCache: true,
        permissions: ['/monitoring/error-handling'],
        activeMenu: '/monitoring/error-handling',
      },
    },
    {
      path: 'update-process-event/:id',
      name: 'update-process-event',
      component: () => import('@/views/monitoring/error-handling/updateProcessEvent.vue'),
      meta: {
        title: 'errorHandlingMonitoring',
        hidden: true,
        noCache: true,
        permissions: ['/monitoring/error-handling'],
        activeMenu: '/monitoring/error-handling',
      },
    },
    {
      path: 'VEC-request-processing',
      name: 'VEC-request-processing',
      component: () => import('@/views/monitoring/request-processing-ETC/index.vue'),
      meta: {
        title: 'VECRequestProcessingMonitoring',
        noCache: false,
        permissions: ['/monitoring/VEC-request-processing'],
      },
    },
    {
      path: 'request-processing/:id?',
      name: 'request-processing',
      component: () =>
        import('@/views/monitoring/request-processing-ETC/viewRequestProcessing.vue'),
      meta: {
        title: 'VECRequestProcessingMonitoring',
        hidden: true,
        noCache: false,
        permissions: ['/monitoring/VEC-request-processing'],
        activeMenu: '/monitoring/VEC-request-processing',
      },
    },
    {
      path: 'request-processing-view/:id?',
      name: 'request-processing-view',
      component: () => import('@/views/monitoring/request-processing-ETC/requestProcessing.vue'),
      meta: {
        title: 'VECRequestProcessingMonitoring',
        hidden: true,
        noCache: false,
        permissions: ['/monitoring/VEC-request-processing'],
        activeMenu: '/monitoring/VEC-request-processing',
      },
    },
    {
      path: 'add-new-request-processing/:id',
      name: 'add-new-request-processing',
      component: () =>
        import('@/views/monitoring/request-processing-ETC/addNewContentRequestVEC.vue'),
      meta: {
        title: 'VECRequestProcessingMonitoring',
        hidden: true,
        noCache: false,
        permissions: ['/monitoring/VEC-request-processing'],
        activeMenu: '/monitoring/VEC-request-processing',
      },
    },
    {
      path: 'device-ETC',
      name: 'device-ETC',
      component: () => import('@/views/monitoring/ETC-device/index.vue'),
      meta: {
        title: 'ETCDeviceMonitoring',
        noCache: false,
        permissions: ['/monitoring/device-ETC'],
      },
    },
    {
      path: 'rating',
      name: 'rating',
      component: () => import('@/views/monitoring/rating/index.vue'),
      meta: {
        title: 'ratingAndScoring',
        noCache: false,
        permissions: ['/monitoring/rating'],
      },
    },
    {
      path: 'rating/add',
      name: 'rating-add',
      component: () => import('@/views/monitoring/rating/addRating.vue'),
      meta: {
        title: 'ratingAndScoring',
        hidden: true,
        noCache: false,
        permissions: ['/monitoring/rating'],
        activeMenu: '/monitoring/rating',
      },
    },
    {
      path: 'rating/edit/:id',
      name: 'rating-edit',
      component: () => import('@/views/monitoring/rating/editRating.vue'),
      meta: {
        title: 'ratingAndScoring',
        hidden: true,
        noCache: false,
        permissions: ['/monitoring/rating'],
        activeMenu: '/monitoring/rating',
      },
    },
    {
      path: 'rating/view/:id',
      name: 'rating-view',
      component: () => import('@/views/monitoring/rating/viewRating.vue'),
      meta: {
        title: 'ratingAndScoring',
        hidden: true,
        noCache: false,
        permissions: ['/monitoring/rating'],
        activeMenu: '/monitoring/rating',
      },
    },
    {
      path: 'toll-collection-report',
      name: 'toll-collection-report',
      // component: () => import('@/views/monitoring/request-processing-ETC/index.vue'),
      meta: {
        title: 'tollCollectionReport',
        noCache: false,
        permissions: ['/monitoring/toll-collection-report'],
      },
      children: [
        {
          path: 'scoring-log',
          name: 'diary',
          component: () => import('@/views/monitoring/diary/index.vue'),
          meta: {
            title: 'monitoringLog',
            noCache: false,
            permissions: ['/monitoring/toll-collection-report/scoring-log'],
          },
        },
        {
          path: 'periodic-monitoring',
          name: 'periodic-monitoring',
          component: () =>
            import('@/views/monitoring/toll-collection-report/periodic-monitoring/index.vue'),
          meta: {
            title: 'periodicMonitoring',
            noCache: false,
            permissions: ['/monitoring/toll-collection-report/periodic-monitoring'],
          },
        },
        {
          path: 'periodic-monitoring/add',
          name: 'periodic-monitoring-add',
          component: () =>
            import('@/views/monitoring/toll-collection-report/periodic-monitoring/addPeriodic.vue'),
          meta: {
            title: 'periodicMonitoring',
            hidden: true,
            noCache: false,
            permissions: ['/monitoring/toll-collection-report/periodic-monitoring'],
            activeMenu: '/monitoring/toll-collection-report/periodic-monitoring',
          },
        },
        {
          path: 'periodic-monitoring/edit/:id',
          name: 'periodic-monitoring-edit',
          component: () =>
            import(
              '@/views/monitoring/toll-collection-report/periodic-monitoring/editPeriodic.vue'
            ),
          meta: {
            title: 'periodicMonitoring',
            hidden: true,
            noCache: false,
            permissions: ['/monitoring/toll-collection-report/periodic-monitoring'],
            activeMenu: '/monitoring/toll-collection-report/periodic-monitoring',
          },
        },
        {
          path: 'periodic-monitoring/view/:id',
          name: 'periodic-monitoring-view',
          component: () =>
            import(
              '@/views/monitoring/toll-collection-report/periodic-monitoring/viewPeriodic.vue'
            ),
          meta: {
            title: 'periodicMonitoring',
            hidden: true,
            noCache: false,
            permissions: ['/monitoring/toll-collection-report/periodic-monitoring'],
            activeMenu: '/monitoring/toll-collection-report/periodic-monitoring',
          },
        },
        {
          path: 'handling-error-request-VEC',
          name: 'handling-error-request-VEC',
          component: () =>
            import(
              '@/views/monitoring/toll-collection-report/handling-error-request-VEC/index.vue'
            ),
          meta: {
            title: 'handlingErrorRequestVEC',
            noCache: false,
            permissions: ['/monitoring/toll-collection-report/handling-error-request-VEC'],
          },
        },
      ],
    },
  ],
}
