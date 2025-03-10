import Layout from '@/layout/index.vue'
import Empty from '@/layout/empty.vue'

export default {
  path: '/reconciliation',
  component: Layout,
  meta: {
    title: 'reconciliation',
    icon: 'icon-menu-reconciliation',
    noCache: false,
    root: true,
    permissions: ['/reconciliation'],
  },
  children: [
    {
      path: 'toll-report',
      name: 'tollReportReconciliation',
      component: () => import('@/views/reconciliation/toll-report/index.vue'),
      meta: {
        title: 'tollReportReconciliation',
        noCache: true,
        permissions: ['/reconciliation/toll-report'],
      },
    },
    {
      path: 'exempt-vehicle',
      name: 'exemptVehicleReconciliation',
      component: () => import('@/views/reconciliation/exempt-vehicle/index.vue'),
      meta: {
        title: 'exemptVehicleReconciliation',
        noCache: true,
        permissions: ['/reconciliation/exempt-vehicle'],
      },
    },
    {
      path: 'post-inspection',
      name: 'postInspectionReconciliation',
      component: () => import('@/views/reconciliation/post-inspection/index.vue'),
      meta: {
        title: 'postInspectionReconciliation',
        noCache: true,
        permissions: ['/reconciliation/post-inspection'],
      },
    },
    {
      path: 'post-inspection/add',
      name: 'addPostInspectionReconciliation',
      component: () => import('@/views/reconciliation/post-inspection/add-report.vue'),
      meta: {
        hidden: true,
        title: 'postInspectionReconciliation',
        noCache: true,
        permissions: ['/reconciliation/post-inspection'],
        activeMenu: ['/reconciliation/post-inspection'],
      },
    },
    {
      path: 'post-inspection/edit/:id',
      name: 'editPostInspectionReconciliation',
      component: () => import('@/views/reconciliation/post-inspection/edit-report.vue'),
      meta: {
        hidden: true,
        title: 'postInspectionReconciliation',
        noCache: true,
        permissions: ['/reconciliation/post-inspection'],
        activeMenu: ['/reconciliation/post-inspection'],
      },
    },
    {
      path: 'post-inspection/view/:id',
      name: 'viewPostInspectionReconciliation',
      component: () => import('@/views/reconciliation/post-inspection/view-report.vue'),
      meta: {
        hidden: true,
        title: 'postInspectionReconciliation',
        noCache: true,
        permissions: ['/reconciliation/post-inspection'],
        activeMenu: ['/reconciliation/post-inspection'],
      },
    },
    {
      path: 'unusual',
      name: 'unusualReconciliation',
      component: () => import('@/views/reconciliation/unusual/index.vue'),
      meta: {
        title: 'unusualReconciliation',
        noCache: true,
        permissions: ['/reconciliation/unusual'],
      },
    },
    {
      path: 'reconciliation-config',
      name: 'configureReconciliation',
      component: () => import('@/views/reconciliation/configuration/index.vue'),
      meta: {
        title: 'configureReconciliation',
        noCache: true,
        permissions: ['/reconciliation/reconciliation-config'],
      },
    },
  ],
}
