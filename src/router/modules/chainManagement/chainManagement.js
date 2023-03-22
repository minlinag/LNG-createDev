export default [
    {
        name: '联锁管理',
        path: '/chainManagement',
        component: () => import('@/views/chainManagement/chainManagement.vue'),
        meta: {
            requireAuth: true,
            type: true
        },
        children: [
            {
                name: '联锁管理台账',
                path: '/chainManagementAccount',
                component: () => import('@/views/chainManagement/modules/chainManagementAccount/chainManagementAccount.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
            },
            {
                name: '联锁解除申请',
                path: '/chainReleaseApplication',
                component: () => import('@/views/chainManagement/modules/chainReleaseApplication.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
            },
            {
                name: '联锁恢复申请',
                path: '/interlockRecoveryApplication',
                component: () => import('@/views/chainManagement/modules/interlockRecoveryApplication.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
            },
        ]
    }
]
