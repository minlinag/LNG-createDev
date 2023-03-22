export default [
  {
    name: '台账自定义配置',
    path: '/accountConfig',
    component: () => import('@/views/accountManagement/index.vue'),
    meta: {
      requireAuth: true,
      type: true
    },
    children: [
      {
        name: '台账字段',
        path: '/masterData',
        component: () => import('@/views/accountManagement/modules/masterData.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      {
        name: '设备分类',
        path: '/featureClassification',
        component: () => import('@/views/accountManagement/modules/featureClassification.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      {
        name: '设备台账',
        path: '/equipmentmasterData',
        component: () => import('@/views/accountManagement/modules/equipmentmasterData.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      {
        name: '编辑包含的特征主数据',
        path: '/editAccount',
        component: () => import('@/views/accountManagement/modules/editAccount.vue'),
        meta: {
          requireAuth: false,
          type: false
        },
      },
      // /:id/:total
      {
        name: '编辑特征主数据',
        path: '/dataEditing',
        component: () => import('@/views/accountManagement/modules/dataEditing.vue'),
        meta: {
          requireAuth: false,
          type: false
        },
      }
    ]
  }
]
