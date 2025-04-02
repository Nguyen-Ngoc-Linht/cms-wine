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
      path: 'manage/view/?:id',
      name: 'product-manage-view',
      component: () => import('@/views/product/view.vue'),
      meta: {
        title: 'Quản lý sản phẩm',
        noCache: true,
        hidden: true,
        permissions: [''],
      },
    },
    {
      path: 'manage/add',
      name: 'product-manage-add',
      component: () => import('@/views/product/add.vue'),
      meta: {
        title: 'Quản lý sản phẩm',
        noCache: true,
        hidden: true,
        permissions: [''],
      },
    },
    {
      path: 'manage/edit/?:id',
      name: 'product-manage-edit',
      component: () => import('@/views/product/edit.vue'),
      meta: {
        title: 'Quản lý sản phẩm',
        noCache: true,
        hidden: true,
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
