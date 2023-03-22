// // 风险管理
export default [
  //目录路由
  {
    name: '一机一档',
    path: '/oneMachineOneFile',
    component: () => import('@/views/oneMachineOneFile/oneMachineOneFile.vue'),
    redirect: '/oneMachineOneFile',
    meta: {
      requireAuth: true,
      type: true
    },
    children: [
      {
        name: '设备维护界面',
        path: '/deviceMaintenance',
        component: () => import('@/views/oneMachineOneFile/modules/deviceMaintenance.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      {
        name: '设备界面展示',
        path: '/fileDeviceInterfaceDisplay',
        component: () => import('@/views/oneMachineOneFile/modules/deviceInterfaceDisplay.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      { 
        name: '设备档案',
        path: '/oneMachineOneFileDeviceFile',
        component: () => import('@/views/oneMachineOneFile/modules/deviceFile'),
        meta: {
          requireAuth: true,
          type: false
        },
      },
    ]
  }
]

