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
      path: 'bank-account1',
      name: 'bank-manage1',
      component: () => import('@/views/bank-account/manage.vue'),
      meta: {
        title: 'Báo cáo doanh thu theo ngày',
        noCache: true,
        permissions: [''],
      },
    },
    {
      path: 'transaction-log1',
      name: 'transaction-log1',
      component: () => import('@/views/transaction-log/manage.vue'),
      meta: {
        title: 'Báo cáo doanh thu theo tháng',
        noCache: true,
        permissions: [''],
      },
    },
    {
      path: 'attributes1',
      name: 'product-attributes11',
      component: () => import('@/views/attributes/index.vue'),
      meta: {
        title: 'Báo cáo doanh thu theo năm',
        noCache: true,
        permissions: [''],
      },
    },
  ],
}
