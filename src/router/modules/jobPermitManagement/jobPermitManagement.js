// 作业许可管理
export default [
  {
    name: '作业许可管理',
    path: '/jobPermitManagement',
    component: () => import('@/views/jobPermitManagement/jobPermitManagement.vue'),
    // redirect: '/JSAAnalysis',
    meta: {
      requireAuth: true,
      type: true
    },
    children: [
      {
        name: 'JSA分析',
        path: '/JSAAnalysis',
        component: () => import('@/views/jobPermitManagement/modules/JSAAnalysis.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      {
        name: 'JSA分析审核',
        path: '/JSAAnalysisApproval',
        component: () => import('@/views/jobPermitManagement/modules/workLicense/components/JSAAnalysisApproval.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      //作业许可
      {
        name: '作业许可申请',
        path: '/workLicense',
        component: () => import('@/views/jobPermitManagement/modules/workLicense/workLicense.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      //作业许可
      {
        name: '作业许可台账',
        path: '/workPermitStatistics',
        component: () => import('@/views/jobPermitManagement/modules/workLicense/workPermitStatistics.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      {
        name: '作业许可统计',
        path: '/operationpermitStatistics',
        component: () => import('@/views/jobPermitManagement/modules/operationpermitStatistics.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
    ]
  }
]
