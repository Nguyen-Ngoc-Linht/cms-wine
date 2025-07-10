import Layout from '@/layout/index.vue'

export default {
  path: '/setting',
  component: Layout,
  meta: {
    title: 'Cài đặt',
    icon: 'icon-menu-setting',
    noCache: false,
    root: true,
    permissions: [''],
  },
  children: [
    {
      path: 'bank-account',
      name: 'bank-manage',
      component: () => import('@/views/bank-account/manage.vue'),
      meta: {
        title: 'Quản lý tài khoản nhận tiền',
        noCache: true,
        permissions: [''],
      },
    },
    {
      path: 'transaction-log',
      name: 'transaction-log',
      component: () => import('@/views/transaction-log/manage.vue'),
      meta: {
        title: 'Quản lý lịch sử giao dịch',
        noCache: true,
        permissions: [''],
      },
    },
    {
      path: 'chatbot-setting',
      name: 'chatbot-setting',
      component: () => import('@/views/chatbot/manage.vue'),
      meta: {
        title: 'Cài đặt dữ liệu chatbot',
        noCache: true,
        permissions: [''],
      },
    },
    {
      path: 'policy',
      name: 'policy',
      component: () => import('@/views/system/policy.vue'),
      meta: {
        title: 'Chính sách hệ thống',
        noCache: true,
        permissions: [''],
      },
    },
    {
      path: 'banner',
      name: 'banner',
      component: () => import('@/views/system/banner.vue'),
      meta: {
        title: 'Banner',
        noCache: true,
        permissions: [''],
      },
    },
  ],
}
