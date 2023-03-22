export default [
  {
    name: '运行数据管理',
    path: '/operatingData',
    component: () => import('@/views/operatingData/index.vue'),
    // redirect: '/annualMaintenance',
    meta: {
      requireAuth: true,
      type: true
    },
    children: [
      {
        name: '设备类型维护',
        path: '/operatingDataDeviceTypeMaintenance',
        component: () => import('@/views/operatingData/deviceTypeMaintenance/index.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      {
        name: '测点类别维护',
        path: '/operatingDataMeasurementPointCategoryMaintenance',
        component: () => import('@/views/operatingData/measurementPointCategoryMaintenance/index.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      }, {
        name: '仪表位号管理',
        path: '/operatingDataInstrumentTagManagement',
        component: () => import('@/views/operatingData/instrumentTagManagement/index.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      {
        name: '运行数据上报',
        path: '/operatingDataReport',
        component: () => import('@/views/operatingData/operatingDataReport/index.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
    ]
  }
]