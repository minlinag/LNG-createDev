//库存管理路由
export default [
    //画面路由
    // {

    // },
    //目录路由
    {
        name: '库存管理',
        path: '/inventoryManagement',
        component: () => import('@/views/inventoryManagement/inventoryManagement.vue'),
        // redirect: '/inventoryManagement',
        meta: {
            requireAuth: true,
            type: true
        },
        children: [

            {
                name: '自动盘库',
                path: '/automaticInventory',
                component: () => import('@/views/inventoryManagement/modules/automaticInventory.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
            },
            {
                name: '一键盘库',
                path: '/oneClickInventory',
                component: () => import('@/views/inventoryManagement/modules/oneClickInventory.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
            },
            {
                name: '一键盘库审批',
                path: '/oneClickInventoryApprovalPage',
                component: () => import('@/views/inventoryManagement/modules/oneClickInventoryApprovalPage.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
            },

            {
                name: '基础数据维护',
                path: '/BasicData',
                component: () => import('@/views/inventoryManagement/modules/BasicData.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
            },
        ]
    }
]