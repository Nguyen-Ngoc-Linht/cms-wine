import Layout from '@/layout/index.vue'

export default {
  path: '/explanation-support',
  name: 'explanationSupport',
  component: Layout,
  meta: {
    title: 'explanationSupport',
    icon: 'icon-menu-report',
    noCache: false,
    root: true,
    permissions: ['/explanation-support'],
  },
  children: [
    {
      path: '',
      name: 'vecExplanationSupport',
      component: () => import('@/views/explanation-support/index.vue'),
      meta: {
        title: 'explanationSupport',
        noCache: false,
        permissions: ['/explanation-support'],
      },
    },
    {
      path: 'detail/:id',
      name: 'vecExplanationSupportDetail',
      component: () => import('@/views/explanation-support/detail-explanation.vue'),
      meta: {
        title: 'explanationSupport',
        noCache: false,
        permissions: ['/explanation-support'],
        hidden: true,
      },
    },
    {
      path: 'edit-explanation-quick/:id',
      name: 'editExplanationQuick',
      component: () => import('@/views/explanation-support/edit-explanation-quick.vue'),
      meta: {
        title: 'explanationSupport',
        noCache: false,
        permissions: ['/explanation-support'],
        hidden: true,
      },
    },
    {
      path: 'create-report/:id',
      name: 'createExplanationReport',
      component: () => import('@/views/explanation-support/add-explanation-report.vue'),
      meta: {
        title: 'explanationSupport',
        noCache: false,
        permissions: ['/explanation-support'],
        hidden: true,
      },
    },
    {
      path: 'create-quick/:id',
      name: 'createExplanationQuick',
      component: () => import('@/views/explanation-support/add-explanation-quick.vue'),
      meta: {
        title: 'explanationSupport',
        noCache: false,
        permissions: ['/explanation-support'],
        hidden: true,
      },
    },
  ],
}
