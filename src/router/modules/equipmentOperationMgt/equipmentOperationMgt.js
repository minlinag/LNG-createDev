export default [
    {
    name: '设备运行管理',
    path: '/equipmentOperationMgt',
    component: () => import('@/views/equipmentOperationMgt/index.vue'),
    // redirect: '/annualMaintenance',
    meta: {
      requireAuth: true,
      type: true
    },
    children: [
        {
            name: '设备看板',
            path: '/equipmentKanban',
            component: () => import('@/views/equipmentOperationMgt/modules/equipmentKanban/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
            children: [
              {
                name: '维护界面',
                path: '/maintain',
                component: () => import('@/views/equipmentOperationMgt/modules/equipmentKanban/modules/maintain/index.vue'),
                meta: {
                  requireAuth: true,
                  type: true
                }
              },
              {
                name: '设备综合看板',
                path: '/comprehensiveKanban',
                component: () => import('@/views/equipmentOperationMgt/modules/equipmentKanban/modules/comprehensiveKanban/index.vue'),
                meta: {
                  requireAuth: true,
                  type: true
                }
              },
              {
                name: '设备综合看板-详情',
                path: '/comprehensiveKanbanDetail',
                component: () => import('@/views/equipmentOperationMgt/modules/equipmentKanban/modules/comprehensiveKanban/detail.vue'),
                meta: {
                  requireAuth: false,
                  type: false
                }
              }
            ]
        },
        {
            name: '设备异常缺陷记录',
            path: '/equipmentExceptionPermissionRecord',
            component: () => import('@/views/equipmentOperationMgt/modules/equipmentExceptionPermissionRecord/index.vue'),
            meta: {
                requireAuth: true,
                type: true
            }
        },
        {
            name: '启停计划管理',
            path: '/comprehensiveStartupAndShutdownPlanMgt',
            component: () => import('@/views/equipmentOperationMgt/modules/comprehensiveStartupAndShutdownPlanMgt/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
            children: [
              {
                name: '维护界面',
                path: '/maintainStartupAndShutdown',
                component: () => import('@/views/equipmentOperationMgt/modules/equipmentKanban/modules/maintain/index.vue'),
                meta: {
                  requireAuth: true,
                  type: true
                }
              },
              {
                name: '设备启停计划',
                path: '/equipmentStartupAndShutdownPlan',
                component: () => import('@/views/equipmentOperationMgt/modules/comprehensiveStartupAndShutdownPlanMgt/modules/equipmentStartupAndShutdownPlan/index.vue'),
                meta: {
                  requireAuth: true,
                  type: true
                }
              },
              {
                name: '设备启停计划',
                path: '/equipmentStartupAndShutdownPlanDetail',
                component: () => import('@/views/equipmentOperationMgt/modules/comprehensiveStartupAndShutdownPlanMgt/modules/equipmentStartupAndShutdownPlan/detail.vue'),
                meta: {
                  requireAuth: false,
                  type: false
                }
              }
            ]
        },
        {
          name: '设备运行台账',
          path: '/operationAccount',
          component: () => import('@/views/equipmentOperationMgt/modules/operationAccount/index.vue'),
          meta: {
              requireAuth: true,
              type: true
          }
      },
    ]
    }      
]