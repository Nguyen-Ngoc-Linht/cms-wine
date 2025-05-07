import Layout from '@/layout/index.vue'

export default {
  path: '/communication',
  component: Layout,
  meta: {
    title: 'Truyền thông',
    icon: 'icon-menu-reconciliation',
    noCache: false,
    root: true,
    permissions: [''],
  },
  children: [
    {
      path: 'post',
      name: 'communication-post',
      component: () => import('@/views/communication/post/index.vue'),
      meta: {
        title: 'Quản lý bài viết',
        noCache: true,
        permissions: [''],
      },
    },
    {
      path: 'post/add',
      name: 'communication-post-add',
      component: () => import('@/views/communication/post/add.vue'),
      meta: {
        title: 'Quản lý bài viết',
        noCache: true,
        hidden: true,
        permissions: [''],
      },
    },
    {
      path: 'post/view',
      name: 'communication-post-view',
      component: () => import('@/views/communication/post/view.vue'),
      meta: {
        title: 'Quản lý bài viết',
        noCache: true,
        hidden: true,
        permissions: [''],
      },
    },
    {
      path: 'post/edit/:id',
      name: 'communication-post-edit',
      component: () => import('@/views/communication/post/edit.vue'),
      meta: {
        title: 'Quản lý bài viết',
        noCache: true,
        hidden: true,
        permissions: [''],
      },
    },
    {
      path: 'product-view',
      name: 'communication-product-view',
      component: () => import('@/views/product/manage.vue'),
      meta: {
        title: 'Sản phẩm truyền thông',
        noCache: true,
        permissions: [''],
      },
    },
  ],
}
