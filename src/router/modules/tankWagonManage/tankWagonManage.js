//调度调度管理路由
export default [
    //画面路由
    // {
    //     name: '承运商管理',
    //     path: '/carrierInfoChange',
    //     component: () => import('@/views/tankWagonManage/modules/qualificationReview/modules/carrierInfoChange.vue'),
    //     meta: {
    //         requireAuth: true,
    //         type: false
    //     },
    // },
    // {
    //     name: '车辆管理',
    //     path: '/vehicleInfoChange',
    //     component: () => import('@/views/tankWagonManage/modules/qualificationReview/modules/vehicleInfoChange.vue'),
    //     meta: {
    //         requireAuth: true,
    //         type: false
    //     },
    // },
    // {
    //     name: '司押人员管理',
    //     path: '/custodiansInfoChange',
    //     component: () => import('@/views/tankWagonManage/modules/qualificationReview/modules/custodiansInfoChange.vue'),
    //     meta: {
    //         requireAuth: true,
    //         type: false
    //     },
    // },
    {
        name: '装车日报',
        path: '/loadingDailyDetail',
        component: () => import('@/views/tankWagonManage/modules/loadingDailyDetail.vue'),
        meta: {
            requireAuth: true,
            type: false
        },
    },
    //目录路由
    {
        name: '槽车管理',
        path: '/tankWagonManage',
        component: () => import('@/views/tankWagonManage/tankWagonManage.vue'),
        // redirect: '/inventoryManagement',
        meta: {
            requireAuth: true,
            type: true
        },
        children: [
            {
                name: '资格审查',
                path: '/qualificationReview',
                component: () => import('@/views/tankWagonManage/modules/qualificationReview/qualificationReview.vue'),
                // redirect: '/inventoryManagement',
                meta: {
                    requireAuth: true,
                    type: true
                },
                children: [
                    {
                        name: '承运商管理',
                        path: '/carrierInfo',
                        component: () => import('@/views/tankWagonManage/modules/qualificationReview/modules/carrierInfo.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '承运商管理审批',
                        path: '/carrierInfoApprovalPage',
                        component: () => import('@/views/tankWagonManage/modules/qualificationReview/modules/carrierInfoApprovalPage.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '车辆管理',
                        path: '/vehicleInfo',
                        component: () => import('@/views/tankWagonManage/modules/qualificationReview/modules/vehicleInfo.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '车辆管理审批',
                        path: '/vehicleInfoApprovalPage',
                        component: () => import('@/views/tankWagonManage/modules/qualificationReview/modules/vehicleInfoApprovalPage.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '司押人员管理',
                        path: '/custodiansInfo',
                        component: () => import('@/views/tankWagonManage/modules/qualificationReview/modules/custodiansInfo.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '司押人员管理审批',
                        path: '/custodiansInfoApprovalPage',
                        component: () => import('@/views/tankWagonManage/modules/qualificationReview/modules/custodiansInfoApprovalPage.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                ]
            },
            {
                name: '安检管理',
                path: '/SecurityInspectionManagement',
                component: () => import('@/views/tankWagonManage/modules/SecurityInspectionManagement/SecurityInspectionManagement.vue'),
                // redirect: '/inventoryManagement',
                meta: {
                    requireAuth: true,
                    type: true
                },
                children: [
                    {
                        name: '安检项配置',
                        path: '/SecurityCheckConfiguration',
                        component: () => import('@/views/tankWagonManage/modules/SecurityInspectionManagement/modules/SecurityCheckConfiguration.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '安检记录',
                        path: '/SecurityInspectionRecord',
                        component: () => import('@/views/tankWagonManage/modules/SecurityInspectionManagement/modules/SecurityInspectionRecord.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                ]
            },
            {
                name: '槽车外输调度令管理',
                path: '/tankWagonExported',
                component: () => import('@/views/tankWagonManage/modules/tankWagonExported.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
            },
            {
                name: '远程叫车',
                path: '/remoteCallCar',
                component: () => import('@/views/tankWagonManage/modules/remoteCallCar.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
            },
            {
                name: '装车日报',
                path: '/loadingDaily',
                component: () => import('@/views/tankWagonManage/modules/loadingDaily.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
            },
            {
                name: '装车日报审批',
                path: '/loadingDailyApprovalPage',
                component: () => import('@/views/tankWagonManage/modules/loadingDailyApprovalPage.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
            },
            {
                name: '装车记录',
                path: '/LoadingRecord',
                component: () => import('@/views/tankWagonManage/modules/LoadingRecord.vue'),
                meta: {
                    requireAuth: true,
                    type: true
                },
            },
            // {
            //     name: '违规管理',
            //     path: '/Violation',
            //     component: () => import('@/views/tankWagonManage/modules/Violation.vue'),
            //     meta: {
            //         requireAuth: true,
            //         type: true
            //     },
            // },
            // {
            //     name: '司机考试培训管理',
            //     path: '/ExaminationTraining',
            //     component: () => import('@/views/tankWagonManage/modules/examination/ExaminationTraining.vue'),
            //     // redirect: '/inventoryManagement',
            //     meta: {
            //         requireAuth: true,
            //         type: true
            //     },
            //     children: [
            //         {
            //             name: '培训资料管理',
            //             path: '/TrainingMaterials',
            //             component: () => import('@/views/tankWagonManage/modules/examination/modules/TrainingMaterials.vue'),
            //             meta: {
            //                 requireAuth: true,
            //                 type: true
            //             },
            //         },
            //         {
            //             name: '试卷管理',
            //             path: '/testPaper',
            //             component: () => import('@/views/tankWagonManage/modules/examination/modules/testPaper.vue'),
            //             meta: {
            //                 requireAuth: true,
            //                 type: true
            //             },
            //         },
            //         {
            //             name: '考试记录',
            //             path: '/ExaminationRecord',
            //             component: () => import('@/views/tankWagonManage/modules/examination/modules/ExaminationRecord.vue'),
            //             meta: {
            //                 requireAuth: true,
            //                 type: true
            //             },
            //         },
            //     ]
            // },
        ]
    }

]