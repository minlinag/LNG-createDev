import requirt from '@/utils/request'
// 查询
export function findAllList(params) {
    return requirt({
        url: '/TankerExportDispatchTaskController/findAllList',
        method: 'get',
        params: params,
    })
}
// 审批
export function Audio(params, auditStatus) {
    return requirt({
        url: '/TankerExportDispatchTaskController/Audio?auditStatus=' + auditStatus,
        method: 'post',
        data: params,
    })
}