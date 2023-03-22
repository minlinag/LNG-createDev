// 安全风险管控
export default [
  {
    name: '隐患管理',
    path: '/treatmentHiddenDanger',
    component: () => import('@/views/treatmentHiddenDanger/treatmentHiddenDanger.vue'),
    meta: {
      requireAuth: true,
      type: true
    },
    children: [
      {
        name: '隐患管理',
        path: '/hiddenDangerManagement',
        component: () => import('@/views/treatmentHiddenDanger/modules/hiddenDangerManagement.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
    ]
  }
]