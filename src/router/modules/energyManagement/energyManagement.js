
export default [
    //目录路由
    {
        name: '能耗管理',
        path: '/energyManagement',
        component: () => import('@/views/energyManagement/energyManagement.vue'),
        redirect: '/energyManagement',
        meta: {
            requireAuth: true,
            type: true
        },
        children: [
            {
                name: '能耗统计',
                path: '/energyStatistics',
                component: () => import('@/views/energyManagement/modules/energyStatistics/energyStatistics.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
                children: [
                    {
                        name: '液氮消耗记录',
                        path: '/liquidNitrogenDailyRecord',
                        component: () => import('@/views/energyManagement/modules/energyStatistics/modules/liquidNitrogen/modules/liquidNitrogenDailyRecord.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '液氮消耗月报',
                        path: '/liquidNitrogenMonthlyRecord',
                        component: () => import('@/views/energyManagement/modules/energyStatistics/modules/liquidNitrogen/modules/liquidNitrogenMonthlyRecord.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '耗水记录',
                        path: '/waterDailyReport',
                        component: () => import('@/views/energyManagement/modules/energyStatistics/modules/water/modules/waterDailyReport.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '耗水统计月报',
                        path: '/waterMonthlyReport',
                        component: () => import('@/views/energyManagement/modules/energyStatistics/modules/water/modules/waterMonthlyReport.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '耗电记录',
                        path: '/electricDailyReport',
                        component: () => import('@/views/energyManagement/modules/energyStatistics/modules/electric/modules/electricDailyReport.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '耗电统计月报',
                        path: '/electricMonthlyRecord',
                        component: () => import('@/views/energyManagement/modules/energyStatistics/modules/electric/modules/electricMonthlyRecord.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '柴油消耗月报',
                        path: '/dieselOilMonthlyReport',
                        component: () => import('@/views/energyManagement/modules/energyStatistics/modules/dieselOil/modules/dieselOilMonthlyReport.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                ]
            },
            {
                name: '能耗分析',
                path: '/energyAnalysisManagement',
                component: () => import('@/views/energyManagement/modules/energyAnalysis/energyAnalysisManagement.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
                children: [
                    {
                        name: '综合能耗',
                        path: '/comprehensiveEnergy',
                        component: () => import('@/views/energyManagement/modules/energyAnalysis/comprehensiveEnergy.vue'),

                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '能耗分析',
                        path: '/energyAnalysis',
                        component: () => import('@/views/energyManagement/modules/energyAnalysis/energyAnalysis.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                ]
            },
        ]
    },

]
