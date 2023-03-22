
import requirt from '@/utils/request'
// 含分页条件查询停送电申请
export function findAllList(params) {
    return requirt({
        url: '/StopDeliveryElectApplyController/findAllList',
        method: 'get',
        params: params,
    })
}
// 新增停送电申请信息
export function insertStopDelivery(params) {
    return requirt({
        url: '/StopDeliveryElectApplyController/insert',
        method: 'post',
        data: params,
    })
}
// 编辑停送电申请信息
export function updateStopDelivery(params) {
    return requirt({
        url: '/StopDeliveryElectApplyController/update',
        method: 'post',
        data: params,
    })
}

// 编号生成
export function generateNumber(params) {
    return requirt({
        url: '/StopDeliveryElectApplyController/generateNumber',
        method: 'get',
        params: params,
    })
}

// 批量删除停送电申请信息
//删除年度计划编码
export function deleteBatch(params) {
    return requirt({
        url: '/StopDeliveryElectApplyController/deleteBatch',
        method: 'delete',
        data: params,
    })
}

// 停送电申请开启审批流程
export function applySubmit(params) {
    return requirt({
        url: '/StopDeliveryElectApplyController/ApplySubmit',
        method: 'get',
        params,
    })
}

// 停送电申请开始审批
export function applyAudio(params) {
    return requirt({
        url: '/StopDeliveryElectApplyController/applyAudio',
        method: 'get',
        params,
    })
}
// 停送电申请执行确认操作
export function confirmOperation(params) {
    return requirt({
        url: '/StopDeliveryElectApplyController/confirmOperation',
        method: 'post',
        data: params,
    })
}
export function edit(params) {
    return requirt({
        url: '/Annual/edit',
        method: 'post',
        data: params,
    })
}
