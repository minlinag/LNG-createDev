
import requirt from '@/utils/request'
// 含分页条件查询
export function findAllList(params) {
    return requirt({
        url: '/LockAndUnLockApplyController/findAllList',
        method: 'get',
        params: params,
    })
}
// 新增
export function insertStopDelivery(params) {
    return requirt({
        url: '/LockAndUnLockApplyController/insert',
        method: 'post',
        data: params,
    })
}
// 编辑
export function updateStopDelivery(params) {
    return requirt({
        url: '/LockAndUnLockApplyController/update',
        method: 'post',
        data: params,
    })
}

// 编号生成
export function getTwoNumber(params) {
    return requirt({
        url: '/LockAndUnLockApplyController/generateNumber',
        method: 'get',
        params: params,
    })
}

// 批量删除
export function deleteBatch(params) {
    return requirt({
        url: '/LockAndUnLockApplyController/deleteBatch',
        method: 'delete',
        data: params,
    })
}

// 上锁解锁申请开启审批流程
export function applySubmit(params) {
    return requirt({
        url: '/LockAndUnLockApplyController/ApplySubmit',
        method: 'get',
        params,
    })
}

// 开始审批
export function applyAudio(params) {
    return requirt({
        url: '/LockAndUnLockApplyController/applyAudio',
        method: 'get',
        params,
    })
}
// 执行确认操作
export function confirmOperation(params) {
    return requirt({
        url: '/LockAndUnLockApplyController/confirmOperation',
        method: 'post',
        data: params,
    })
}
