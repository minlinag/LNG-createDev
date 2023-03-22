export default [
    {
      name: '审批',
      path: '/approval',
      component: () => import('@/views/approval/approval.vue'),
      meta: {
        requireAuth: true,
        type: true
      },
      children: [
        {
          name: '联锁管理审批',
          path: '/chainApprovalPage',
          component: () => import('@/views/approval/modules/chainApprovalPage.vue'),
          meta: {
            approvalTitle:'审批',
            requireAuth: true,
            type: true
          },
        },
        {
          name: '停送电审批',
          path: '/tsdApprovalPage',
          component: () => import('@/views/approval/modules/tsdApprovalPage.vue'),
          meta: {
            approvalTitle:'审批',
            requireAuth: true,
            type: true
          },
        },
        {
          name: '上锁解锁审批',
          path: '/ssjsApprovalPage',
          component: () => import('@/views/approval/modules/ssjsApprovalPage.vue'),
          meta: {
            approvalTitle:'审批',
            requireAuth: true,
            type: true
          },
        },
        {
          name: '安全检查审批',
          path: '/saftyApproval',
          component: () => import('@/views/approval/modules/saftyApproval.vue'),
          meta: {
            approvalTitle:'审批',
            requireAuth: true,
            type: true
          },
        },
        {
          name: '变更-审批代办',
          path: '/equipmentChangeApprove',
          component: () => import('@/views/equipmentMaintenance/modules/equipmentChangeApplyMgt/components/approve'),
          meta: {
            approvalTitle:'审批',
            requireAuth: true,
            type: true
          },
        },
        {
          name: '报废-审批代办',
          path: '/approve',
          component: () => import('@/views/equipmentMaintenance/modules/equipmentDisAndScrMgt/modules/equipmentDismantleMgt/components/approve'),
          meta: {
            approvalTitle:'审批',
            requireAuth: true,
            type: true
          },
        },
        {
          name: '拆除-审批代办',
          path: '/approveDis',
          component: () => import('@/views/equipmentMaintenance/modules/equipmentDisAndScrMgt/modules/equipmentDismantleMgt/components/approve'),
          meta: {
            approvalTitle:'审批',
            requireAuth: true,
            type: true
          },
        },
        {
          name: '年度-审批代办',
          path: '/submitYearDaiban',
          component: () => import('@/views/equipmentMaintenance/modules/equimentTestOrRulesMgt/modules/components/submitFormDaiban'),
          meta: {
            approvalTitle:'审批',
            requireAuth: true,
            type: true
          },
        },
        {
          name: '待检定-审批代办',
          path: '/waitVerifiedApprovalDaiban',
          component: () => import('@/views/equipmentMaintenance/modules/equimentTestOrRulesMgt/modules/components/addWaitVerifiedApprovalDaiban'),
          meta: {
            approvalTitle:'审批',
            requireAuth: true,
            type: true
          },
        },
      ]
    }
  ]
  