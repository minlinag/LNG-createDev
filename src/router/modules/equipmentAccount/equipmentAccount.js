
export default [
  //画面路由
  // {
  //   name: '新增年度计划表单',
  //   path: '/addequipmentMaintenance',
  //   component: () => import('@/views/equipmentMaintenance/modules/addAnnualplan.vue'),
  //   meta: {
  //     requireAuth: true,
  //     type: false
  //   },
  // },
  // {
  //   name: '新增月度计划表单',
  //   path: '/addMonthequipmentMaintenance',
  //   component: () => import('@/views/equipmentMaintenance/modules/addMonthplan.vue'),
  //   meta: {
  //     requireAuth: true,
  //     type: false
  //   },
  // },
  // {
  //     name:'新增月度润滑计划',
  //     path:'/addMonthLubricationplan',
  //     component: () =>import ('@/views/equipmentMaintenance/modules/addMonthLubricationplan.vue'),
  //     meta: {
  //         requireAuth: true,
  //         type:false
  //     },
  // },
  // {
  //   name: '年度计划明细',
  //   path: '/annualDetails',
  //   component: () => import('@/views/equipmentMaintenance/modules/annualDetails.vue'),
  //   meta: {
  //     requireAuth: true,
  //     type: false
  //   },
  // },
  {
    name: '月度检定计划管理',
    path: '/monthlyVerificationplanManagement',
    component: () => import('@/views/equipmentMaintenance/modules/monthlyVerificationplanManagement.vue'),
    meta: {
      requireAuth: true,
      type: false
    },
  },
  //目录路由
  {
    name: '设备检维修管理',
    path: '/equipmentMaintenance',
    component: () => import('@/views/equipmentMaintenance/equipmentMaintenance.vue'),
    redirect: '/annualMaintenance',
    meta: {
      requireAuth: true,
      type: true
    },
    children: [
      {
        name: '月度计划明细',
        path: '/monthDetails',
        component: () => import('@/views/equipmentMaintenance/modules/preventiveMaintenanceMgt/modules/month/monthDetails.vue'),
        meta: {
          requireAuth: true,
          type: false
        },
      },
      {
        name: '预防性检维修',
        path: '/preventiveMaintenanceMgt',
        redirect: '/annualMaintenance',
        component: () => import('@/views/equipmentMaintenance/modules/preventiveMaintenanceMgt/index.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
        children: [
          {
            name: '年度检维修计划管理',
            path: '/annualMaintenance',
            component: () => import('@/views/equipmentMaintenance/modules/preventiveMaintenanceMgt/modules/year/annualMaintenance.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          }
          , {
            name: '月度检维修计划管理',
            path: '/monthMaintenance',
            component: () => import('@/views/equipmentMaintenance/modules/preventiveMaintenanceMgt/modules/month/monthMaintenance.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          }
        ]
      },
      {
        name: '设备的润滑',
        path: '/lubricationOfEquipmentMgt',
        component: () => import('@/views/equipmentMaintenance/modules/lubricationOfEquipmentMgt/index.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
        children: [
          {
            name: '设备润滑一览表',
            path: '/maintenanceListManagement',
            component: () => import('@/views/equipmentMaintenance/modules/lubricationOfEquipmentMgt/modules/maintenanceManagementList.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
          {

            name: '设备润滑明细',
            path: '/maintenanceManagement',
            component: () => import('@/views/equipmentMaintenance/modules/lubricationOfEquipmentMgt/modules/maintenanceManagement.vue'),
            meta: {
              requireAuth: false,
              type: false
            },
          },
          {
            name: '设备润滑',
            path: '/maintenanceList',
            component: () => import('@/views/equipmentMaintenance/modules/lubricationOfEquipmentMgt/modules/maintenanceList.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
        ]
      },
      {
        name: '故障性检维修',
        path: '/faultyMaintenanceMgt',
        component: () => import('@/views/equipmentMaintenance/modules/faultyMaintenanceMgt/index.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
        children: [
          {
            name: '临时检维修计划',
            path: '/temporaryOverhaulplan',
            component: () => import('@/views/equipmentMaintenance/modules/faultyMaintenanceMgt/modules/temporaryOverhaulplan.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
          {
            name: '大修检维修计划',
            path: '/overhaulPlan',
            component: () => import('@/views/equipmentMaintenance/modules/faultyMaintenanceMgt/modules/overhaulPlan.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          }
        ]
      },
      {
        name: '申请单管理',
        path: '/dispatchingList',
        component: () => import('@/views/equipmentMaintenance/modules/applyMgt/dispatchingList.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      {
        name: '通知单管理',
        path: '/noticeDocuments',
        component: () => import('@/views/equipmentMaintenance/modules/noticeMgt/noticeDocuments.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
      },
      {
        name: '外委单位的管理',
        path: '/outsourcingUnitMgt',
        component: () => import('@/views/equipmentMaintenance/modules/outsourcingUnitMgt/index.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
        children: [
          {
            name: '外委单位清单',
            path: '/outsourceCompany',
            component: () => import('@/views/equipmentMaintenance/modules/outsourcingUnitMgt/modules/outsourceCompany.vue'),
            meta: {
              requireAuth: true,
              type: true
            }
          },
          {
            name: '外委单位合同清单',
            path: '/outsourceCompanyAttachment',
            component: () => import('@/views/equipmentMaintenance//modules/outsourcingUnitMgt/modules/outsourceCompanyAttachment.vue'),
            meta: {
              requireAuth: true,
              type: true
            }
          },
          {
            name: '外委单位工单管理',
            path: '/outsourcingUnit',
            component: () => import('@/views/equipmentMaintenance//modules/outsourcingUnitMgt/modules//outsourcingUnit.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
        ]
      },
      {
        name: '设备备品备件清单',
        path: '/equipmentSparePartsMgt',
        component: () => import('@/views/equipmentMaintenance/modules/equipmentSparePartsMgt/index.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
        children: [
          {
            name: '备品备件与设备关系维护',
            path: '/applicationForMaintenanceOfSpareParts',
            component: () => import('@/views/equipmentMaintenance/modules/equipmentSparePartsMgt/modules/applicationForMaintenanceOfSpareParts/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            }
          },
          {
            name: '设备备品备件管理',
            path: '/spareParts',
            component: () => import('@/views/equipmentMaintenance/modules/equipmentSparePartsMgt/modules/spareParts.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
          {
            name: '备品备件申请记录',
            path: '/sparePartsApplicationRecord',
            component: () => import('@/views/equipmentMaintenance/modules/equipmentSparePartsMgt/modules/sparePartsApplicationRecord/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            }
          },
        ]
      },
      {
        name: '年度设备润滑计划-先不要',
        path: '/annualLubrication',
        component: () => import('@/views/equipmentMaintenance/modules/annualLubrication.vue'),
        meta: {
          requireAuth: true,
          type: false
        },
      },
      // {
      //     name: '月度设备润滑计划',
      //     path: '/monthLubrication',
      //     component: () => import('@/views/equipmentMaintenance/modules/monthLubrication.vue'),
      //     meta: {
      //         requireAuth: true,
      //         type: true
      //     },
      // },
      {
        name: '设备的变更管理',
        path: '/equipmentChangeApplyMgt',
        component: () => import('@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/index.vue'),
        meta: {
          requireAuth: true,
          type: true
        }
      },
      {
        name: '设备报废与拆除',
        path: '/equipmentDisAndScrMgt',
        component: () => import('@/views/equipmentMaintenance/modules/equipmentDisAndScrMgt/index.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
        children: [
          {
            name: '设备报废管理',
            path: '/equipmentScrapMgt',
            component: () => import('@/views/equipmentMaintenance/modules/equipmentDisAndScrMgt/modules/equipmentScrapMgt/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            }
          },
          {
            name: '设备拆除管理',
            path: '/equipmentDismantleMgt',
            component: () => import('@/views/equipmentMaintenance/modules/equipmentDisAndScrMgt/modules/equipmentDismantleMgt/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            }
          }
        ]
      },
      {
        name: '设备检定与校验',
        path: '/equimentTestOrRulesMgt',
        component: () => import('@/views/equipmentMaintenance/modules/equimentTestOrRulesMgt/index.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
        children: [
          {
            name: '设备检定-维护界面',
            path: '/equipmentVerificationMaintenance',
            component: () => import('@/views/equipmentMaintenance/modules/equimentTestOrRulesMgt/modules/equipmentVerificationMaintenance.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
          {
            name: '年度检定计划',
            path: '/verificationPlanYear',
            component: () => import('@/views/equipmentMaintenance/modules/equimentTestOrRulesMgt/modules/verificationPlanYear.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
          {
            name: '年度审批',
            path: '/submitYear',
            component: () => import('@/views/equipmentMaintenance/modules/equimentTestOrRulesMgt/modules/submitYear.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
          {
            name: '月度检定计划',
            path: '/verificationPlanMonth',
            component: () => import('@/views/equipmentMaintenance/modules/equimentTestOrRulesMgt/modules/verificationPlanMonth.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
          {
            name: '待检定',
            path: '/waitVerified',
            component: () => import('@/views/equipmentMaintenance/modules/equimentTestOrRulesMgt/modules/waitVerified.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
          {
            name: '待检定-审批',
            path: '/waitVerifiedApproval',
            component: () => import('@/views/equipmentMaintenance/modules/equimentTestOrRulesMgt/modules/waitVerifiedApproval.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
          {
            name: '待检定-审批页面',
            path: '/waitVerifiedApprovalPage',
            component: () => import('@/views/equipmentMaintenance/modules/equimentTestOrRulesMgt/modules/components/waitVerifiedApprovalPage.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
          {
            name: '已检定',
            path: '/verified',
            component: () => import('@/views/equipmentMaintenance/modules/equimentTestOrRulesMgt/modules/verified/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
            children: [
              {
                name: '已检定-合格',
                path: '/qualified',
                component: () => import('@/views/equipmentMaintenance/modules/equimentTestOrRulesMgt/modules/verified/modules/qualified.vue'),
                meta: {
                  requireAuth: true,
                  type: true
                },
              },
              {
                name: '已检定-不合格',
                path: '/unqualified',
                component: () => import('@/views/equipmentMaintenance/modules/equimentTestOrRulesMgt/modules/verified/modules/unqualified.vue'),
                meta: {
                  requireAuth: true,
                  type: true
                },
              },
            ]
          },
        ]
      },
      {
        name: '新增年度计划表单',
        path: '/addequipmentMaintenance',
        component: () => import('@/views/equipmentMaintenance/modules/preventiveMaintenanceMgt/modules/year/addAnnualplan.vue'),
        meta: {
          requireAuth: true,
          type: false
        },
      },

      {
        name: '月度设备检定计划-详情',
        path: '/editMonthDetails',
        component: () => import('@/views/equipmentMaintenance/modules/equimentTestOrRulesMgt/modules/editMonthDetails.vue'),
        meta: {
          requireAuth: true,
          type: false
        },
      },
      {
        name: '新增月度计划表单',
        path: '/addMonthequipmentMaintenance',
        component: () => import('@/views/equipmentMaintenance/modules/preventiveMaintenanceMgt/modules/month/addMonthplan.vue'),
        meta: {
          requireAuth: true,
          type: false
        },
      },
      {
        name: '年度计划明细',
        path: '/annualDetails',
        component: () => import('@/views/equipmentMaintenance/modules/preventiveMaintenanceMgt/modules/year/annualDetails.vue'),
        meta: {
          requireAuth: true,
          type: false
        },
      },
      {
        name: '临时计划清单',
        path: '/temporaryListplan',
        component: () => import('@/views/equipmentMaintenance/modules/temporaryListplan.vue'),
        meta: {
          requireAuth: true,
          type: false
        },
      },


      // {
      //     name:'设备备件清单',
      //     path:'/equipmentList',
      //     component: () =>import ('@/views/equipmentMaintenance/modules/equipmentList.vue'),
      //     meta: {
      //         requireAuth: true,
      //         type:true
      //     },
      // },
    ]
  },

]
