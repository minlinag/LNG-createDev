export default [
  {
    name: '变电站操作票管理',
    path: '/substationOperationTicketManagement',
    component: () => import('@/views/substationOperationTicketManagement/substationOperationTicketManagement.vue'),
    // redirect: '/annualMaintenance',
    meta: {
      requireAuth: true,
      type: true
    },
    children: [
      {
        name: '倒闸操作票管理',
        path: '/switchingOperationTicketManagement',
        component: () => import('@/views/substationOperationTicketManagement/switchingOperationTicketManagement/index.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
        children: [
          {
            name: '倒闸操作票申请',
            path: '/switchingOperationTicketApply',
            component: () => import('@/views/substationOperationTicketManagement/switchingOperationTicketManagement/apply/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
          {
            name: '倒闸操作票台账',
            path: '/switchingOperationTicketLedger',
            component: () => import('@/views/substationOperationTicketManagement/switchingOperationTicketManagement/ledger/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          }, {
            name: '倒闸操作票审批',
            path: '/switchingOperationTicketApproval',
            component: () => import('@/views/substationOperationTicketManagement/switchingOperationTicketManagement/components/switchingOperationTicketApproval.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
        ]
      }, {
        name: '第一种工作票管理',
        path: '/firstJobTicket',
        component: () => import('@/views/substationOperationTicketManagement/jobTicket/index.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
        children: [
          {
            name: '第一种工作票申请',
            path: '/firstJobTicketApply',
            component: () => import('@/views/substationOperationTicketManagement/jobTicket/apply/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
          {
            name: '第一种工作票台账',
            path: '/firstJobTicketLedger',
            component: () => import('@/views/substationOperationTicketManagement/jobTicket/ledger/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          }, {
            name: '第一种工作票审批',
            path: '/firstJobTicketApproval',
            component: () => import('@/views/substationOperationTicketManagement/jobTicket/components/jobTicketApproval.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
        ]
      }, {
        name: '第二种工作票管理',
        path: '/secondWorkTicket',
        component: () => import('@/views/substationOperationTicketManagement/jobTicket/index.vue'),
        meta: {
          requireAuth: true,
          type: true
        },
        children: [
          {
            name: '第二种工作票申请',
            path: '/secondWorkTicketApply',
            component: () => import('@/views/substationOperationTicketManagement/jobTicket/apply/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
          {
            name: '第二种工作票台账',
            path: '/secondWorkTicketLedger',
            component: () => import('@/views/substationOperationTicketManagement/jobTicket/ledger/index.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          }, {
            name: '第二种工作票审批',
            path: '/secondWorkTicketApproval',
            component: () => import('@/views/substationOperationTicketManagement/jobTicket/components/jobTicketApproval.vue'),
            meta: {
              requireAuth: true,
              type: true
            },
          },
        ]
      },
    ]
  }
]