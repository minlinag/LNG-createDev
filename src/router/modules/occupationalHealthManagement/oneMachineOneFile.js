
export default [
  //目录路由
  {
    name: '职业健康管理',
    path: '/occupationalHealthManagement',
    component: () => import('@/views/occupationalHealthManagement'),
    redirect: '/occupationalHealthManagement',
    meta: {
      requireAuth: true,
      type: true
    },
    children: [
      {
        name: '劳保用品申请',
        path: '/laborInsuranceSuppliesApplication',
        component: () => import('@/views/occupationalHealthManagement/laborInsuranceSuppliesApplication'),
        meta: {
          requireAuth: true,
          type: true
        },
      }, {
        name: '劳保用品申请台账',
        path: '/laborInsuranceSuppliesApplicationLedger',
        component: () => import('@/views/occupationalHealthManagement/laborInsuranceSuppliesApplicationLedger'),
        meta: {
          requireAuth: true,
          type: true
        },
      }, {
        name: '劳保用品申请审批',
        path: '/laborInsuranceSuppliesApplicationApproval',
        component: () => import('@/views/occupationalHealthManagement/components/laborInsuranceSuppliesApplicationApproval'),
        meta: {
          requireAuth: true,
          type: true
        },
      }, {
        name: '个人防护用品卡',
        path: '/personalProtectiveEquipmentCard',
        component: () => import('@/views/occupationalHealthManagement/personalProtectiveEquipmentCard'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      {
        name: '职业健康档案管理',
        path: '/occupationalHealthArchivesManagement',
        component: () => import('@/views/occupationalHealthManagement/occupationalHealthArchivesManagement/index.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
        children: [
          {
            name: '职业健康危害因素分析',
            path: '/analysisOccupationalHealthHazards',
            component: () => import('@/views/occupationalHealthManagement/occupationalHealthArchivesManagement/analysisOccupationalHealthHazards/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          }, {
            name: '职业健康档案',
            path: '/occupationalHealthRecords',
            component: () => import('@/views/occupationalHealthManagement/occupationalHealthArchivesManagement/occupationalHealthRecords/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          }
        ]
      }
    ]
  }
]

