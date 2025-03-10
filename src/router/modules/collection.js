import Layout from '@/layout/index.vue'
import Empty from '@/layout/empty.vue'

export default {
  path: '/collection',
  component: Layout,
  meta: {
    title: 'dataCollection',
    icon: 'icon-menu-collection',
    noCache: false,
    root: true,
    permissions: ['/collection'],
  },
  children: [
    {
      path: 'report',
      name: 'dataCollectionReport',
      component: () => import('@/views/collection/report/index.vue'),
      meta: {
        title: 'dataCollectionReport',
        noCache: true,
        permissions: ['/collection/report'],
      },
    },
    {
      path: 'incident',
      name: 'incidentManagement',
      component: () => import('@/views/collection/incident/index.vue'),
      meta: {
        title: 'incidentManagement',
        noCache: true,
        permissions: ['/collection/incident'],
      },
    },
    // {
    //   path: 'logfile-device',
    //   name: 'collectLogfileDevice',
    //   component: () => import('@/views/collection/logfile-device/index.vue'),
    //   meta: {
    //     title: 'collectLogfileDevice',
    //     noCache: true,
    //     permissions: ['/collection/logfile-device'],
    //   },
    // },
    {
      path: 'logfile',
      name: 'collectLogfile',
      component: () => import('@/views/collection/logfile/index.vue'),
      meta: {
        title: 'collectLogfile',
        noCache: true,
        permissions: ['/collection/logfile'],
      },
    },
    // {
    //   path: 'be',
    //   name: 'collectBE',
    //   component: () => import('@/views/collection/be/index.vue'),
    //   meta: {
    //     title: 'collectBE',
    //     noCache: true,
    //     permissions: ['/collection/be'],
    //   },
    // },
    // {
    //   path: 'fe',
    //   name: 'collectApiFe',
    //   component: () => import('@/views/collection/fe/index.vue'),
    //   meta: {
    //     title: 'collectApiFe',
    //     noCache: true,
    //     permissions: ['/collection/fe'],
    //   },
    // },
    {
      path: 'exempt-vehicle',
      name: 'collectVehicle',
      component: () => import('@/views/collection/exempt-vehicle/index.vue'),
      meta: {
        title: 'collectVehicle',
        noCache: true,
        permissions: ['/collection/exempt-vehicle'],
      },
    },
    {
      path: 'standardize-data',
      name: 'standardizeData',
      component: () => import('@/views/collection/standardize-data/index.vue'),
      meta: {
        title: 'standardizeData',
        noCache: true,
        permissions: ['/collection/standardize-data'],
      },
    },
    {
      path: 'configuration',
      name: 'collectionConfiguration',
      component: () => import('@/views/collection/configuration/index.vue'),
      meta: {
        title: 'collectionConfiguration',
        noCache: true,
        permissions: ['/collection/configuration'],
      },
    },
    {
      path: 'standardize-configuration',
      name: 'standardizeConfiguration',
      component: () => import('@/views/collection/standardized-configuration/index.vue'),
      meta: {
        title: 'standardConfig',
        noCache: true,
        // permissions: ['/collection/standardize-configuration'],
        permissions: [''],
      },
    },
  ],
}
