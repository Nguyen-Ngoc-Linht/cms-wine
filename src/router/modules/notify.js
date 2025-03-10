import Layout from '@/layout/index.vue'

export default {
  path: '/notify',
  name: 'notify',
  component: Layout,
  meta: {
    title: 'notify',
    icon: 'notify',
    noCache: false,
    hidden: true,
  },
  children: [
    {
      path: 'notify',
      name: 'notify',
      component: () => import('@/views/notify/index.vue'),
      meta: {
        title: 'notify',
        noCache: false,
      },
    },
  ],
}
