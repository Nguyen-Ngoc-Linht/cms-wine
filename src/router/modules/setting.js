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
      path: 'attributes',
      name: 'product-attributes1',
      component: () => import('@/views/attributes/index.vue'),
      meta: {
        title: 'Quản lý giao diện',
        noCache: true,
        permissions: [''],
      },
    },
    {
      path: 'attributes',
      name: 'product-attributes2',
      component: () => import('@/views/attributes/index.vue'),
      meta: {
        title: 'Lịch sử hoạt động',
        noCache: true,
        permissions: [''],
      },
    },
  ],
}
