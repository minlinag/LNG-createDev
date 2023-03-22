export default [
  {
    name: '模板管理',
    path: '/templateManagement',
    component: () => import('@/views/templateManagement/index.vue'),
    meta: {
      requireAuth: true,
      type: true
    },
  }
]