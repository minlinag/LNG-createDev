// 安全风险管控
export default [
  {
    name: '安全风险管控',
    path: '/riskcontrol',
    component: () => import('@/views/securityRiskcontrol/securityRiskcontrol.vue'),
    redirect: '/saferiskManagement',
    meta: {
      requireAuth: true,
      type: true
    },
    children: [
      {
        name: '风险清单',
        path: '/saferiskManagement',
        component: () => import('@/views/securityRiskcontrol/modules/saferiskManagement.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
        children: [
          {
            name: '风险清单',
            path: '/riskList',
            component: () => import('@/views/securityRiskcontrol/modules/riskList/modules/riskList.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
          {
            name: '重大风险清单',
            path: '/listOfMajorRisks',
            component: () => import('@/views/securityRiskcontrol/modules/riskList/modules/listOfMajorRisks.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },

        ]
      },
      {
        name: '风险清单申报',
        path: '/risklistDeclaration',
        component: () => import('@/views/securityRiskcontrol/modules/risklistDeclaration.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      {
        name: '安全风险培训',
        path: '/riskManagementTraining',
        component: () => import('@/views/securityRiskcontrol/modules/riskManagementTraining.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },   
      {
        name: '风险空间分布图',
        path: '/spatialDistribution',
        component: () => import('@/views/securityRiskcontrol/modules/spatialDistribution.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
    ]
  }
]