//库存管理路由
export default [
  //画面路由
  // {

  // },
  //目录路由
  {
    name: '单据管理',
    path: '/dispatching',
    component: () => import('@/views/dispatching/dispatching.vue'),
    redirect: '/dispatchingList',
    meta: {
      requireAuth: true,
      type: true
    },
    children: [


      {
        name: '设备检维修台账',
        path: '/equipmentAccount',
        component: () => import('@/views/dispatching/modules/equipmentAccount.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
    ]
  }
]
