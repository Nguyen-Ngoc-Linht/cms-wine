import Layout from '@/layout/index.vue'

export default {
  path: '/inventory',
  component: Layout,
  meta: {
    title: 'Quản lý kho',
    icon: 'icon-app-menu-tsc',
    noCache: false,
    root: true,
    permissions: [''],
  },
  children: [
    {
      path: 'manage',
      name: 'inventory',
      component: () => import('@/views/inventory/manage.vue'),
      meta: {
        title: 'Quản lý hàng',
        noCache: true,
        permissions: [''],
      },
    },
    {
      path: 'log',
      name: 'inventory-log',
      component: () => import('@/views/inventory/inventory-log.vue'),
      meta: {
        title: 'Lịch sử nhập hàng',
        noCache: true,
        permissions: [''],
      },
    },
  ],
}
