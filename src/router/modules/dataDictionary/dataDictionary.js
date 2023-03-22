
export default [
    // {
    //     path: '/index',
    //     name: '首页',
    //     component: () =>
    //       import( /* webpackChunkName: "page" */ '@/views/wel'),
    //     meta: {
    //       requireAuth: true,
    //     }
    // },
    //画面路由
    // {
    //     name:'新增专业库',
    //     path:'/addequipmentMaintenance',
    //     component: () =>import ('@/views/equipmentMaintenance/modules/addAnnualplan.vue'),
    //     meta: {
    //         requireAuth: true,
    //         type:false
    //     },
    // },







    //目录路由
    {
        name: '数据字典',
        path: '/dataDictionary',
        component: () => import('@/views/dataDictionary/dataDictionary.vue'),
        redirect: '/professionalLibrary',
        meta: {
            requireAuth: true,
            type: true
        },
        children: [
            {
                name:'数据字典',
                path:'/professionalLibrary',
                component: () =>import ('@/views/dataDictionary/modules/professionalLibrary.vue'),
                meta: {
                    requireAuth: true,
                    type:true
                },
            },
            // {
            //     name:'数据字典',
            //     path:'/dictionData',
            //     component: () =>import ('@/views/dataDictionary/modules/dictionData.vue'),
            //     meta: {
            //         requireAuth: true,
            //         type:true
            //     },
            // },
            // {
            //     name:'阀值管理',
            //     path:'/thresholdManagement',
            //     component: () =>import ('@/views/dataDictionary/modules/thresholdManagement.vue'),
            //     meta: {
            //         requireAuth: true,
            //         type:true
            //     },
            // },
            // {
            //     name: '模块',
            //     path: '/dataDictionaryModule',
            //     component: () => import('@/views/dataDictionary/modules/dataDictionaryModule.vue'),
            //     meta: {
            //         requireAuth: true,
            //         type: true
            //     },
            // }

        ]
    }
]
