//调度调度管理路由
export default [
    {
        name: '生产日报',
        path: '/productionReportDailyChange',
        component: () => import('@/views/dispatchingManagement/modules/dispatchReport/modules/productionReportDailyChange.vue'),
        meta: { requireAuth: true, type: false },
    },
    {
        name: '生产月报',
        path: '/productionReportMonthlyChange',
        component: () => import('@/views/dispatchingManagement/modules/dispatchReport/modules/productionReportMonthlyChange.vue'),
        meta: {
            requireAuth: true,
            type: false
        },
    },
    {
        name: '月度生产运行计划',
        path: '/monthProductionOperationDetail',
        component: () => import('@/views/dispatchingManagement/modules/ProductionOperation/modules/monthProductionOperationDetail.vue'),
        meta: { requireAuth: true, type: false },
    },

    //目录路由
    {
        name: '运行调度管理',
        path: '/dispatchingManagement',
        component: () => import('@/views/dispatchingManagement/dispatchingManagement.vue'),
        // redirect: '/inventoryManagement',
        meta: { requireAuth: true, type: true },
        children: [
            {
                name: '调度看板',
                path: '/SchedulingKanban',
                component: () => import('@/views/dispatchingManagement/modules/SchedulingKanban.vue'),
                meta: { requireAuth: true, type: true },
            },
            {
                name: '卸船计划',
                path: '/unloadingPlan',
                component: () => import('@/views/dispatchingManagement/modules/dispatchingOperation/modules/unloadingPlan.vue'),
                meta: { requireAuth: true, type: true },
            },
            {

                name: '卸船记录',
                path: '/dischargingRecord',
                component: () => import('@/views/dispatchingManagement/modules/dispatchingOperation/modules/dischargingRecord.vue'),
                meta: { requireAuth: true, type: true },
            },
            {
                name: '气化外输调度令',
                path: '/gasificationOutgoingDispatch',
                component: () => import('@/views/dispatchingManagement/modules/dispatchingOperation/modules/gasificationOutgoingDispatch.vue'),
                meta: { requireAuth: true, type: true },
            },
            {
                name: '调度报表',
                path: '/dispatchReport',
                component: () => import('@/views/dispatchingManagement/modules/dispatchReport/dispatchReport.vue'),
                // redirect: '/inventoryManagement',
                meta: {
                    requireAuth: true,
                    type: true
                },
                children: [
                    {
                        name: '生产日报',
                        path: '/productionReportDaily',
                        component: () => import('@/views/dispatchingManagement/modules/dispatchReport/modules/productionReportDaily.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '生产日报审批',
                        path: '/productionReportDailyApprovalPage',
                        component: () => import('@/views/dispatchingManagement/modules/dispatchReport/modules/productionReportDailyApprovalPage.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '生产月报',
                        path: '/productionReportMonthly',
                        component: () => import('@/views/dispatchingManagement/modules/dispatchReport/modules/productionReportMonthly.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '生产月报审批',
                        path: '/productionReportMonthlyApprovalPage',
                        component: () => import('@/views/dispatchingManagement/modules/dispatchReport/modules/productionReportMonthlyApprovalPage.vue'),
                        meta: {
                            requireAuth: true,
                            type: true
                        },
                    },
                ]
            },
            {
                name: '生产运行计划',
                path: '/ProductionOperation',
                component: () => import('@/views/dispatchingManagement/modules/ProductionOperation/ProductionOperation.vue'),
                meta: { requireAuth: true, type: true },
                children: [
                    {
                        name: '年度生产运行计划',
                        path: '/yearProductionOperation',
                        component: () => import('@/views/dispatchingManagement/modules/ProductionOperation/modules/yearProductionOperation.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                    {
                        name: '年度生产运行计划审批',
                        path: '/yearApprovalPage',
                        component: () => import('@/views/dispatchingManagement/modules/ProductionOperation/modules/yearApprovalPage.vue'),
                        meta: {
                            approvalTitle: '审批',
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '月度生产运行计划',
                        path: '/monthProductionOperation',
                        component: () => import('@/views/dispatchingManagement/modules/ProductionOperation/modules/monthProductionOperation.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                    {
                        name: '月度生产运行计划审批',
                        path: '/monthApprovalPage',
                        component: () => import('@/views/dispatchingManagement/modules/ProductionOperation/modules/monthApprovalPage.vue'),
                        meta: {
                            approvalTitle: '审批',
                            requireAuth: true,
                            type: true
                        },
                    },
                    {
                        name: '年度生产计划执行情况跟踪',
                        path: '/yearProductionOperationTrack',
                        component: () => import('@/views/dispatchingManagement/modules/ProductionOperation/modules/yearProductionOperationTrack.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                    {
                        name: '月度生产计划执行情况跟踪',
                        path: '/monthProductionOperationTrack',
                        component: () => import('@/views/dispatchingManagement/modules/ProductionOperation/modules/monthProductionOperationTrack.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                ]
            },
            {
                name: '操作卡管理',
                path: '/OperationCardManagement',
                component: () => import('@/views/dispatchingManagement/modules/OperationCardManagement/OperationCardManagement.vue'),
                meta: { requireAuth: true, type: true },
                children: [
                    // operatingProcedure
                    {
                        name: '操作规程管理',
                        path: '/operatingProcedure',
                        component: () => import('@/views/dispatchingManagement/modules/OperationCardManagement/modules/operatingProcedure/operatingProcedure.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                    {
                        name: '操作卡版本管理',
                        path: '/versionManagement',
                        component: () => import('@/views/dispatchingManagement/modules/OperationCardManagement/modules/versionManagement.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                    {
                        name: '操作卡下载管理',
                        path: '/downloadManagement',
                        component: () => import('@/views/dispatchingManagement/modules/OperationCardManagement/modules/downloadManagement.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                    {
                        name: '操作卡归档',
                        path: '/Archive',
                        component: () => import('@/views/dispatchingManagement/modules/OperationCardManagement/modules/Archive.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                ]
            },
            {
                name: '值班管理',
                path: '/dutyManagement',
                component: () => import('@/views/dispatchingManagement/modules/dutyManagement/dutyManagement.vue'),
                meta: { requireAuth: true, type: true },
                children: [
                    {
                        name: '班组管理',
                        path: '/teamManagement',
                        component: () => import('@/views/dispatchingManagement/modules/dutyManagement/modules/teamManagement.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                    {
                        name: '班组量化考核规则管理',
                        path: '/assessmentRules',
                        component: () => import('@/views/dispatchingManagement/modules/dutyManagement/modules/assessmentRules.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                    {
                        name: '班组量化考核',
                        path: '/assessment',
                        component: () => import('@/views/dispatchingManagement/modules/dutyManagement/modules/assessment.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                    {
                        name: '班组量化考核审批',
                        path: '/assessmentApprovalPage',
                        component: () => import('@/views/dispatchingManagement/modules/dutyManagement/modules/assessmentApprovalPage.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                    {
                        name: '班组加分申请',
                        path: '/Bonuspoints',
                        component: () => import('@/views/dispatchingManagement/modules/dutyManagement/modules/Bonuspoints.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                    {
                        name: '班组加分申请审批',
                        path: '/BonuspointsApprovalPage',
                        component: () => import('@/views/dispatchingManagement/modules/dutyManagement/modules/BonuspointsApprovalPage.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                    {
                        name: '月度量化考核成绩',
                        path: '/monthlyResults',
                        component: () => import('@/views/dispatchingManagement/modules/dutyManagement/modules/monthlyResults.vue'),
                        meta: { requireAuth: true, type: true },
                    },

                ]
            },
            {
                name: '交接班管理',
                path: '/SuccessionManagement',
                component: () => import('@/views/dispatchingManagement/modules/SuccessionManagement/SuccessionManagement.vue'),
                meta: { requireAuth: true, type: true },
                children: [
                    {
                        name: '交接班',
                        path: '/ChangeShifts',
                        component: () => import('@/views/dispatchingManagement/modules/SuccessionManagement/modules/ChangeShifts/index.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                    {
                        name: '运行班组交接班',
                        path: '/OperationTeamgroup',
                        component: () => import('@/views/dispatchingManagement/modules/SuccessionManagement/modules/OperationTeamgroup.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                    {
                        name: '槽车区交接班',
                        path: '/TankTeamgroup',
                        component: () => import('@/views/dispatchingManagement/modules/SuccessionManagement/modules/TankTeamgroup.vue'),
                        meta: { requireAuth: true, type: true },
                    },

                ]
            },
            {
                name: '槽车考核管理',
                path: '/TanklorryManagement',
                component: () => import('@/views/dispatchingManagement/modules/TanklorryManagement/TanklorryManagement.vue'),
                meta: { requireAuth: true, type: true },
                children: [
                    {
                        name: '违规级别配置',
                        path: '/ViolationsLevelConfiguration',
                        component: () => import('@/views/dispatchingManagement/modules/TanklorryManagement/modules/ViolationsLevelConfiguration.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                    {
                        name: '违规项配置',
                        path: '/ViolationsConfiguration',
                        component: () => import('@/views/dispatchingManagement/modules/TanklorryManagement/modules/ViolationsConfiguration.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                    {
                        name: '违规管理',
                        path: '/ViolationsManagement',
                        component: () => import('@/views/dispatchingManagement/modules/TanklorryManagement/modules/ViolationsManagement.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                    {
                        name: '承运单位考核统计',
                        path: '/CarrierInitStatistical',
                        component: () => import('@/views/dispatchingManagement/modules/TanklorryManagement/modules/CarrierInitStatistical.vue'),
                        meta: { requireAuth: true, type: true },
                    },
                ]
            },
        ]
    }
]
