import Layout from '@/layout/index.vue'
import Empty from '@/layout/empty.vue'

export default {
  path: '/administration',
  component: Layout,
  meta: {
    title: 'administration',
    icon: 'icon-menu-setting',
    noCache: false,
    root: true,
    permissions: ['/administration'],
  },
  children: [
    {
      path: '/administration/system',
      component: Empty,
      meta: {
        root: true,
        title: 'administrationSystem',
        noCache: false,
        permissions: ['/administration/system'],
      },
      children: [
        {
          path: 'user',
          name: 'userManagement',
          component: () => import('@/views/administration/system/user/index.vue'),
          meta: {
            title: 'userManagement',
            noCache: true,
            permissions: ['/administration/system/user'],
          },
        },
        {
          path: 'user/add',
          name: 'addUser',
          component: () => import('@/views/administration/system/user/add-user.vue'),
          meta: {
            title: 'userManagement',
            noCache: true,
            permissions: ['/administration/system/user'],
            hidden: true,
            activeMenu: '/administration/system/user',
          },
        },
        {
          path: 'user/edit/:id',
          name: 'editUser',
          component: () => import('@/views/administration/system/user/edit-user.vue'),
          meta: {
            title: 'userManagement',
            noCache: true,
            permissions: ['/administration/system/user'],
            hidden: true,
            activeMenu: '/administration/system/user',
          },
        },
        {
          path: 'user/detail/:id',
          name: 'detailUser',
          component: () => import('@/views/administration/system/user/detail-user.vue'),
          meta: {
            title: 'userManagement',
            noCache: true,
            permissions: ['/administration/system/user'],
            hidden: true,
            activeMenu: '/administration/system/user',
          },
        },
        {
          path: 'role',
          name: 'roleManagement',
          component: () => import('@/views/administration/system/role/index.vue'),
          meta: {
            title: 'roleManagement',
            noCache: true,
            permissions: ['/administration/system/role'],
          },
        },
        {
          path: 'role/add',
          name: 'addRole',
          component: () => import('@/views/administration/system/role/add-role.vue'),
          meta: {
            title: 'roleManagement',
            noCache: true,
            permissions: ['/administration/system/role'],
            hidden: true,
            activeMenu: '/administration/system/role',
          },
        },
        {
          path: 'role/edit/:id',
          name: 'editRole',
          component: () => import('@/views/administration/system/role/edit-role.vue'),
          meta: {
            title: 'roleManagement',
            noCache: true,
            permissions: ['/administration/system/role'],
            hidden: true,
            activeMenu: '/administration/system/role',
          },
        },
        {
          path: 'role/detail/:id',
          name: 'detailRole',
          component: () => import('@/views/administration/system/role/detail-role.vue'),
          meta: {
            title: 'roleManagement',
            noCache: true,
            permissions: ['/administration/system/role'],
            hidden: true,
            activeMenu: '/administration/system/role',
          },
        },
        {
          path: 'password-policy',
          name: 'passwordPolicy',
          component: () => import('@/views/administration/system/password-policy/index.vue'),
          meta: {
            title: 'passwordPolicy',
            noCache: false,
            permissions: ['/administration/system/password-policy'],
          },
        },
        {
          path: 'session',
          name: 'sessionPolicy',
          component: () => import('@/views/administration/system/session/index.vue'),
          meta: {
            title: 'sessionPolicy',
            noCache: false,
            permissions: ['/administration/system/session'],
          },
        },
        {
          path: 'action',
          name: 'actionManagement',
          component: () => import('@/views/administration/system/action/index.vue'),
          meta: {
            title: 'actionManagement',
            noCache: false,
            permissions: ['/administration/system/action'],
          },
        },
        {
          path: 'captchaConfiguration',
          name: 'captchaConfiguration',
          component: () => import('@/views/administration/system/captcha-configuration/index.vue'),
          meta: {
            title: 'captchaConfiguration',
            noCache: false,
            permissions: ['/administration/system/captchaConfiguration'],
          },
        },
        {
          path: 'ip',
          name: 'ipManagement',
          component: () => import('@/views/administration/system/ip/index.vue'),
          meta: {
            title: 'ipManagement',
            noCache: false,
            permissions: ['/administration/system/ip'],
          },
        },
        {
          path: 'backup',
          name: 'backupManagement',
          component: () => import('@/views/administration/system/backup/index.vue'),
          meta: {
            title: 'backupManagement',
            noCache: false,
            permissions: ['/administration/system/backup'],
          },
        },
        {
          path: 'log',
          name: 'logManagement',
          component: () => import('@/views/administration/system/log/index.vue'),
          meta: {
            title: 'logManagement',
            noCache: false,
            permissions: ['/administration/system/log'],
          },
        },
      ],
    },
    {
      path: '/administration/category',
      name: 'category',
      meta: {
        title: 'administrationCategory',
        noCache: false,
        permissions: ['/administration/category'],
      },
      children: [
        {
          path: 'expressway',
          name: 'expressway',
          component: () => import('@/views/administration/category/expressway/index.vue'),
          meta: {
            title: 'expressway',
            noCache: false,
            permissions: ['/administration/category/expressway'],
          },
        },
        {
          path: 'station/:id?',
          name: 'station',
          component: () => import('@/views/administration/category/expressway/stationDetails.vue'),
          meta: {
            title: 'Quản trị danh mục > Thông tin tuyến cao tốc',
            hidden: true,
            noCache: false,
            permissions: ['/administration/category/expressway'],
            activeMenu: '/administration/category/expressway',
          },
        },
        {
          path: 'station-details-view/:id?',
          name: 'station-details-view',
          component: () =>
            import('@/views/administration/category/expressway/components/viewStation.vue'),
          meta: {
            title: 'Quản trị danh mục > Thông tin tuyến cao tốc',
            hidden: true,
            noCache: false,
            permissions: ['/administration/category/expressway'],
            activeMenu: '/administration/category/expressway',
          },
        },
        {
          path: 'supplier/:id?',
          name: 'supplier',
          component: () => import('@/views/administration/category/expressway/supplierForm.vue'),
          meta: {
            title: 'Quản trị danh mục > Quản lý nhà cung cấp',
            hidden: true,
            noCache: false,
            permissions: ['/administration/category/expressway'],
            activeMenu: '/administration/category/expressway',
          },
        },
        {
          path: 'fare-table',
          name: 'fare-table',
          component: () => import('@/views/administration/category/fare-table/index.vue'),
          meta: {
            title: 'fareTable',
            noCache: false,
            permissions: ['/administration/category/fare-table'],
          },
        },
        {
          path: 'fare-table/add',
          name: 'fare-table-add',
          component: () => import('@/views/administration/category/fare-table/add.vue'),
          meta: {
            title: 'Quản trị danh mục > Bảng cước',
            hidden: true,
            noCache: false,
            permissions: ['/administration/category/fare-table'],
            activeMenu: '/administration/category/fare-table',
          },
        },
        {
          path: 'fare-table/edit/:id',
          name: 'fare-table-edit',
          component: () => import('@/views/administration/category/fare-table/edit.vue'),
          meta: {
            title: 'Quản trị danh mục > Bảng cước',
            hidden: true,
            noCache: false,
            permissions: ['/administration/category/fare-table'],
            activeMenu: '/administration/category/fare-table',
          },
        },
        {
          path: 'fare-table/view/:id',
          name: 'fare-table-view',
          component: () => import('@/views/administration/category/fare-table/view.vue'),
          meta: {
            title: 'Quản trị danh mục > Bảng cước',
            hidden: true,
            noCache: false,
            permissions: ['/administration/category/fare-table'],
            activeMenu: '/administration/category/fare-table',
          },
        },
        {
          path: 'functional-forces',
          name: 'functional-forces',
          component: () => import('@/views/administration/category/functional-forces/index.vue'),
          meta: {
            title: 'functionalForces',
            noCache: false,
            permissions: ['/administration/category/functional-forces'],
          },
        },
        {
          path: 'administrative',
          name: 'administrative',
          component: () =>
            import('@/views/administration/category/administrative-department/index.vue'),
          meta: {
            title: 'administrativeDepartment',
            noCache: false,
            permissions: ['/administration/category/administrative'],
          },
        },
        {
          path: 'statistical-report',
          name: 'statistical-report',
          component: () => import('@/views/administration/category/statistical-report/index.vue'),
          meta: {
            title: 'Chuyển đổi BCTK',
            noCache: false,
            permissions: ['/administration/category/statistical-report'],
          },
        },
      ],
    },
  ],
}
