import Layout from '@/layout/index.vue'

export default {
  path: '/product',
  component: Layout,
  meta: {
    title: 'Sản phẩm',
    icon: 'icon-menu-reconciliation',
    noCache: false,
    root: true,
    permissions: [''],
  },
  children: [
    {
      path: 'manage',
      name: 'product-manage',
      component: () => import('@/views/product/manage.vue'),
      meta: {
        title: 'Quản lý sản phẩm',
        noCache: true,
        permissions: [''],
      },
    },
    {
      path: 'category',
      name: 'product-category',
      component: () => import('@/views/category/index.vue'),
      meta: {
        title: 'Quản lý danh mục',
        noCache: true,
        permissions: [''],
      },
    },
    {
      path: 'attributes',
      name: 'product-attributes',
      component: () => import('@/views/attributes/index.vue'),
      meta: {
        title: 'Quản lý thuộc tính',
        noCache: true,
        permissions: [''],
      },
    },
  ],
}
