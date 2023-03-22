
export default [
    //画面路由
    {
        name: '槽车装车日报明细',
        path: '/tankDailyDetails',
        component: () => import('@/views/meteringManagement/modules/tankersExportedMeter/modules/tankDailyDetails.vue'),
        meta: {
            requireAuth: true,
            type: false
        },
    },
    {
        name: '管道外输日报明细',
        path: '/pipelineDailyDetails',
        component: () => import('@/views/meteringManagement/modules/pipelineOutgoingMetering/modules/pipelineDailyDetails.vue'),
        meta: {
            requireAuth: true,
            type: false
        },
    },
    {
        name: '新增管道外输日报',
        path: '/addPipelineDaily',
        component: () => import('@/views/meteringManagement/modules/pipelineOutgoingMetering/modules/addPipelineDaily.vue'),
        meta: {
            requireAuth: true,
            type: false
        },
    },
    {
        name: '管道外输月报明细',
        path: '/pipelineMonthDetails',
        component: () => import('@/views/meteringManagement/modules/pipelineOutgoingMetering/modules/pipelineMonthDetails.vue'),
        meta: {
            requireAuth: true,
            type: false
        },
    },
    //目录路由
    {
        name: '计量管理',
        path: '/meteringManagement',
        component: () => import('@/views/meteringManagement/meteringManagement.vue'),
        // redirect: '/unloadingMetering',
        meta: {
            requireAuth: true,
            type: true
        },
        children: [
            // {
            //     name: '月度计划明细',
            //     path: '/monthDetails/:id',
            //     component: () => import('@/views/equipmentMaintenance/modules/monthDetails.vue'),
            //     meta: {
            //         requireAuth: true,
            //         type: false
            //     },
            // },
            {
                name: '卸船计量',
                path: '/unloadingMetering',
                component: () => import('@/views/meteringManagement/modules/unloadingMetering.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
            },
            // 槽车外输计量
            {
                name: '槽车外输计量',
                path: '/tankersExportedMeter',
                component: () => import('@/views/meteringManagement/modules/tankersExportedMeter/tankersExportedMeter.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
                children: [
                    // {
                    //     name: '槽车装车记录',
                    //     path: '/slotTruckLoadingRecords',
                    //     component: () => import('@/views/meteringManagement/modules/tankersExportedMeter/modules/slotTruckLoadingRecords.vue'),
                    //     meta: {
                    //         requireAuth: true,
                    //         type: true
                    //     },
                    // },
                    {
                        name: '槽车装车日报',
                        path: '/tankTruckLoadingDaily',
                        component: () => import('@/views/meteringManagement/modules/tankersExportedMeter/modules/tankTruckLoadingDaily.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '槽车装车日报审批',
                        path: '/tankTruckLoadingDailyApprovalPage',
                        component: () => import('@/views/meteringManagement/modules/tankersExportedMeter/modules/tankTruckLoadingDailyApprovalPage.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },


                    {
                        name: '槽车装车月报',
                        path: '/tankTruckLoadingMonth',
                        component: () => import('@/views/meteringManagement/modules/tankersExportedMeter/modules/tankTruckLoadingMonth.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '槽车装车月报审批',
                        path: '/tankTruckLoadingMonthApprovalPage',
                        component: () => import('@/views/meteringManagement/modules/tankersExportedMeter/modules/tankTruckLoadingMonthApprovalPage.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },

                    }
                ]
            },
            //  管道外输计量
            {
                name: '管道外输计量',
                path: '/pipelineOutgoingMetering',
                component: () => import('@/views/meteringManagement/modules/pipelineOutgoingMetering/pipelineOutgoingMetering.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
                children: [
                    {
                        name: '管道外输日报',
                        path: '/pipelineOutgoingDaily',
                        component: () => import('@/views/meteringManagement/modules/pipelineOutgoingMetering/modules/pipelineOutgoingDaily.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '管道外输日报审批',
                        path: '/pipelineOutgoingDailyApprovalPage',
                        component: () => import('@/views/meteringManagement/modules/pipelineOutgoingMetering/modules/pipelineOutgoingDailyApprovalPage.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },

                    {
                        name: '管道外输月报',
                        path: '/pipelineOutgoingMonth',
                        component: () => import('@/views/meteringManagement/modules/pipelineOutgoingMetering/modules/pipelineOutgoingMonth.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '管道外输月报审批',
                        path: '/pipelineOutgoingMonthApprovalPage',
                        component: () => import('@/views/meteringManagement/modules/pipelineOutgoingMetering/modules/pipelineOutgoingMonthApprovalPage.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                ]
            },
            {
                name: '冷能计量',
                path: '/coldEnergyMetering',
                component: () => import('@/views/meteringManagement/modules/coldEnergyMetering/coldEnergyMetering.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
                children: [
                    {
                        name: '用户信息绑定',
                        path: '/userInformationBinding',
                        component: () => import('@/views/meteringManagement/modules/coldEnergyMetering/modules/userInformationBinding.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '冷能计量日报',
                        path: '/coldEnergyMeteringDaily',
                        component: () => import('@/views/meteringManagement/modules/coldEnergyMetering/modules/coldEnergyMeteringDaily.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '冷能计量月报',
                        path: '/coldEnergyMeteringMonthly',
                        component: () => import('@/views/meteringManagement/modules/coldEnergyMetering/modules/coldEnergyMeteringMonthly.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '冷能计量月报审批',
                        path: '/coldEnergyMeteringMonthlyApprovalPage',
                        component: () => import('@/views/meteringManagement/modules/coldEnergyMetering/modules/coldEnergyMeteringMonthlyApprovalPage.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },

                    },
                    {
                        name: '冷耗气计量日报',
                        path: '/coldAirConsumptionDaily',
                        component: () => import('@/views/meteringManagement/modules/coldEnergyMetering/modules/coldAirConsumptionDaily.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '冷耗气计量月报',
                        path: '/coldAirConsumptionMonthly',
                        component: () => import('@/views/meteringManagement/modules/coldEnergyMetering/modules/coldAirConsumptionMonthly.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '冷耗气计量月报审批',
                        path: '/coldAirConsumptionMonthlyApprovalPage',
                        component: () => import('@/views/meteringManagement/modules/coldEnergyMetering/modules/coldAirConsumptionMonthlyApprovalPage.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },

                ]
            },
            {
                name: '自耗气计量',
                path: '/selfConsumptionMetering',
                component: () => import('@/views/meteringManagement/modules/selfConsumptionMetering/selfConsumptionMetering.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
                children: [
                    {
                        name: '自耗气日报',
                        path: '/selfConsumptionDaily',
                        component: () => import('@/views/meteringManagement/modules/selfConsumptionMetering/modules/selfConsumptionDaily.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '自耗气月报',
                        path: '/selfConsumptionMonth',
                        component: () => import('@/views/meteringManagement/modules/selfConsumptionMetering/modules/selfConsumptionMonth.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '自耗气月报审批',
                        path: '/selfConsumptionMonthApprovalPage',
                        component: () => import('@/views/meteringManagement/modules/selfConsumptionMetering/modules/selfConsumptionMonthApprovalPage.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                ]
            },
            {
                name: '计量汇总表',
                path: '/meterSummaryTable',
                component: () => import('@/views/meteringManagement/modules/meterSummaryTable.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
            },
            {
                name: '分析检验管理',
                path: '/AnalysisManagement',
                component: () => import('@/views/meteringManagement/modules/AnalysisManagement.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
            },
            {
                name: '分析检验管理审批',
                path: '/AnalysisManagementApprovalPage',
                component: () => import('@/views/meteringManagement/modules/AnalysisManagementApprovalPage.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
            },
            {
                name: '分析检验管理上传',
                path: '/AnalysisManagementUplode',
                component: () => import('@/views/meteringManagement/modules/AnalysisManagementUplode.vue'),
                meta: {
                    requireAuth: true, type: false
                },
            },




        ]
    },

]
