import requirt from '@/utils/request'
// 获取审批记录
export function getApprovalRecordList(params){
    return requirt({
        url:'/approvalRecord/getListForPage',
        method:'post',
        data:params,
    })
}

