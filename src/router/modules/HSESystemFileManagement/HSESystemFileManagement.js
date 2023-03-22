export default [
  {
    name: 'HSE体系文件管理',
    path: '/HSESystemFileManagementMgt',
    component: () => import('@/views/HSESystemFileManagement/index.vue'),
    // redirect: '/annualMaintenance',
    meta: {
      requireAuth: true,
      type: true
    },
    children: [
      {
        name: 'HSE体系文件',
        path: '/HSESystemFileManagement',
        component: () => import('@/views/HSESystemFileManagement/HSESystemFileManagement/index.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      {
        name: '安全生产责任制',
        path: '/safetyProductionResponsibilitySystem',
        component: () => import('@/views/HSESystemFileManagement/safetyProductionResponsibilitySystem/index.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
        children: [
          {
            name: '部门岗位职责',
            path: '/jobManagement',
            component: () => import('@/views/HSESystemFileManagement/safetyProductionResponsibilitySystem/jobManagement/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          }, {
            name: '人员岗位职责',
            path: '/personnelJobManagement',
            component: () => import('@/views/HSESystemFileManagement/safetyProductionResponsibilitySystem/personnelJobManagement/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          }, {
            name: '责任制考核',
            path: '/personnelAssessment',
            component: () => import('@/views/HSESystemFileManagement/safetyProductionResponsibilitySystem/personnelAssessment/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
            children: [
              {
                name: '部门责任制考核',
                path: '/departmentalResponsibilitySystemAssessment',
                component: () => import('@/views/HSESystemFileManagement/safetyProductionResponsibilitySystem/personnelAssessment/departmentalResponsibilitySystemAssessment/index.vue'),
                meta: {
                  requireAuth: true,
                  type: true
                },
              }, {
                name: '人员责任制考核',
                path: '/personnelResponsibilitySystemAssessment',
                component: () => import('@/views/HSESystemFileManagement/safetyProductionResponsibilitySystem/personnelAssessment/personnelResponsibilitySystemAssessment/index.vue'),
                meta: {
                  requireAuth: true,
                  type: true
                },
              }
            ]
          }
        ]
      },
    ]
  }
]