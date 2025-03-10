import Layout from '@/layout/index.vue'

export default {
  path: '/order',
  name: 'order',
  component: Layout,
  meta: {
    title: 'Đơn hàng',
    icon: 'icon-menu-device',
    noCache: false,
    permissions: ['/dashboard'],
    root: true,
  },
  children: [
    {
      path: '',
      name: 'order-manage',
      component: () => import('@/views/order/index.vue'),
      meta: {
        title: 'Quản lý đơn hàng',
        noCache: false,
        permissions: [''],
      },
    },
  ],
}
