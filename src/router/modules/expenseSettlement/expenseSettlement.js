export default [
    {
    name: '费用结算',
    path: '/expenseSettlement',
    component: () => import('@/views/expenseSettlement/index.vue'),
    // redirect: '/annualMaintenance',
    meta: {
      requireAuth: true,
      type: true
    },
    }      
]