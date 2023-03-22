export default [
    {
    name: '设备绩效指标管理',
    path: '/equipmentPerformanceIndicatorsMgt',
    component: () => import('@/views/equipmentPerformanceIndicatorsMgt/index.vue'),
    // redirect: '/annualMaintenance',
    meta: {
      requireAuth: true,
      type: true
    },
    children: [
        {
            name: '设备绩效指标管理',
            path: '/equipmentPerformanceIndicators',
            component: () => import('@/views/equipmentPerformanceIndicatorsMgt/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
            children: [
              {
                name: '维护界面',
                path: '/equipmentPerformanceIndicatorsMaintain',
                component: () => import('@/views/equipmentOperationMgt/modules/equipmentKanban/modules/maintain/index.vue'),
                meta: {
                  requireAuth: true,
                  type: true
                }
              },
              {
                name: '设备绩效指标',
                path: '/equipmentPerformanceIndicatorsList',
                component: () => import('@/views/equipmentPerformanceIndicatorsMgt/modules/equipmentPerformanceIndicators/index.vue'),
                meta: {
                  requireAuth: true,
                  type: true
                }
              },
              {
                name: '设备绩效指标详情',
                path: '/reportForm',
                component: () => import('@/views/equipmentPerformanceIndicatorsMgt/modules/equipmentPerformanceIndicators/components/reportForm.vue'),
                meta: {
                  requireAuth: false,
                  type: false
                }
              }
            ]
        },
        {
            name: '自定义设备看板',
            path: '/customKanban',
            component: () => import('@/views/equipmentPerformanceIndicatorsMgt/modules/customKanban/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            }
        }
    ]
    }      
]