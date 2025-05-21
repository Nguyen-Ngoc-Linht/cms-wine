import Layout from '@/layout/index.vue'

export default {
  path: '/',
  name: 'dashboard',
  component: Layout,
  meta: {
    title: 'Dashboard',
    icon: 'icon-menu-device',
    noCache: false,
    permissions: ['/dashboard'],
    root: true,
  },
  children: [
    {
      path: '',
      name: 'dashboard-ch',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        title: 'Trang chủ',
        noCache: false,
        permissions: [''],
      },
    },
  ],
}
