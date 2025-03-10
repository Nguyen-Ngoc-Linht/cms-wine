import Layout from '@/layout/index.vue'
import Empty from '@/layout/empty.vue'

export default {
  path: '/user',
  component: Layout,
  meta: {
    title: 'Quản lý tài khoản',
    icon: 'icon-menu-setting',
    noCache: false,
    root: true,
    permissions: [''],
  },
  children: [
    {
      path: '',
      name: 'user-manage',
      component: () => import('@/views/user/index.vue'),
      meta: {
        title: 'Quản lý tài khoản',
        noCache: true,
        permissions: [''],
      },
    },
  ],
}
