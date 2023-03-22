
export default [
    {
        path: '/index',
        name: '首页',
        component: () =>
          import( /* webpackChunkName: "page" */ '@/views/wel'),
        meta: {
          requireAuth: true,
        }
    },
    // {
    //     name:'设备台账',
    //     path:'/index',
    //     component: () =>import ('@/views/standingbook/standingbook.vue'),
    //     redirect: '/equipmentAccount',
    //     meta: {
    //         requireAuth: true,
    //         type:true
    //     },
    //     children:[
    //         {
    //             name:'机械设备台账',
    //             path:'/equipmentAccount',
    //             component: () =>import ('@/views/standingbook/modules/equipmentAccount.vue'),
    //             meta: {
    //                 requireAuth: true,
    //                 type:true
    //             },
    //         }
    //     ]
    // }
]
