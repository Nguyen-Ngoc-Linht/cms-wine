import Layout from '@/layout/index.vue'

export default {
  path: '/report',
  component: Layout,
  meta: {
    title: 'Báo cáo thống kê',
    icon: 'icon-menu-report',
    noCache: false,
    root: true,
    permissions: [''],
  },
  children: [
    {
      path: 'statistical-report',
      name: 'statistical-report',
      component: () => import('@/views/report/manage.vue'),
      meta: {
        title: 'Báo cáo doanh thu',
        noCache: true,
        permissions: [''],
      },
    },
  ],
}
