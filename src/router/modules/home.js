import Layout from '@/layout/index.vue'

export default {
  path: '',
  component: Layout,
  meta: {
    hidden: true,
    root: true,
  },
  children: [
    {
      path: '',
      name: 'home',
      component: () => import('@/views/index.vue'),
      meta: {
        title: 'home',
      },
    },
  ],
}
