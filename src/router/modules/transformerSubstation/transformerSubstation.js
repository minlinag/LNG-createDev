// 变电站
export default [
    {
        name: '变电站',
        path: '/transformerSubstation',
        component: () => import('@/views/transformerSubstation/transformerSubstation.vue'),
        meta: {
            requireAuth: true,
            type: true
        },
        children: [
            {
                name: '停送电申请',
                path: '/stopPowerTransmission',
                component: () => import('@/views/transformerSubstation/modules/stopPowerTransmission.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
            }, 
            {
                name: '上锁解锁申请',
                path: '/lockUnlockApplication',
                component: () => import('@/views/transformerSubstation/modules/lockUnlockApplication.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
            },           
        ]
    }
]