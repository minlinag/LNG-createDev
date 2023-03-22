// // 风险管理
export default [
    //目录路由
    {
        name: '作业风险管理',
        path: '/risk',
        component: () => import('@/views/riskManagement/riskManagement.vue'),
        redirect: '/riskManagement',
        meta: {
            requireAuth: true,
            type: true
        },
        children: [
            {
                name:'风险库',
                path:'/riskManagement',
                component: () =>import ('@/views/riskManagement/modules/riskManagementList.vue'),
                meta: {
                    requireAuth: true,
                    type:true
                },
            },
        ]
    }
]

