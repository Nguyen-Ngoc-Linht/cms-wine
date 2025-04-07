import Layout from '@/layout/index.vue'

export default {
  path: '/dashboard',
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
        title: 'Dashboard',
        noCache: false,
        permissions: [''],
      },
    },
  ],
}
