// 安全风险管控
export default [
  {
    name: '安全检查',
    path: '/securityCheck',
    component: () => import('@/views/securityCheck/securityCheck.vue'),
    meta: {
      requireAuth: true,
      type: true
    },
    children: [
      {
        name: '安全检查',
        path: '/securityCheck',
        component: () => import('@/views/securityCheck/modules/securityCheck.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      {
        name: '安全检查台账',
        path: '/safetyInspectionAccount',
        component: () => import('@/views/securityCheck/modules/safetyInspectionAccount.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      // operatingProcedure
      {
        name: '安全检查整改',
        path: '/safetyInspectionRectification',
        component: () => import('@/views/securityCheck/modules/safetyInspectionRectification.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      {
        name: '安全检查统计',
        path: '/statistics',
        component: () => import('@/views/securityCheck/modules/statistics.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
        children: [
          {
            name: '检查主体',
            path: '/securityCheckStatistics',
            component: () => import('@/views/securityCheck/modules/securityCheckStatistics.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
          {
            name: '检查人',
            path: '/securityRummager',
            component: () => import('@/views/securityCheck/modules/securityRummager.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
        ]
      },
    ]
  }
]
