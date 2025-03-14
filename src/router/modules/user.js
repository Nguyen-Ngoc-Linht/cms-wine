import Layout from '@/layout/index.vue'

export default {
  path: '/user',
  name: 'user',
  component: Layout,
  meta: {
    title: 'Người dùng',
    icon: 'people-all',
    noCache: false,
    permissions: [''],
    root: true,
  },
  children: [
    {
      path: '',
      name: 'user-manage',
      component: () => import('@/views/user/index.vue'),
      meta: {
        title: 'Quản lý người dùng',
        noCache: false,
        permissions: [''],
      },
    },
    {
      path: 'edit/:id',
      name: 'user-manage-edit',
      component: () => import('@/views/user/edit.vue'),
      meta: {
        title: 'Quản lý người dùng',
        noCache: false,
        hidden: true,
        permissions: [''],
      },
    },
  ],
}
