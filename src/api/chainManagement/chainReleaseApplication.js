import requirt from '@/utils/request'

// 含分页条件查询联锁申请信息
export function findAllList(params) {
    return requirt({
        url: '/InterlockApply/findAllList',
        method: 'get',
        params: params,
    })
}

// 新增联锁申请信息
export function insertInterlockApply(params) {
    return requirt({
        url: '/InterlockApply/insert',
        method: 'post',
        data: params,
    })
}

// 编辑联锁申请信息
export function updateInterlockApply(params) {
    return requirt({
        url: '/InterlockApply/update',
        method: 'post',
        data: params,
    })
}

// 查询联锁申请单条信息
export function queryByID(params) {
    return requirt({
        url: '/InterlockApply/queryByID',
        method: 'get',
        params: params,
    })
}

// 查询联锁管理联锁号
export function queryInterlockNo(params) {
    return requirt({
        url: '/InterlockManageLedger/queryInterlockNo',
        method: 'get',
        params: params,
    })
}

// 根据联锁号查询联锁管理信息
export function queryByInterlockNo(params) {
    return requirt({
        url: '/InterlockApply/queryByInterlockNo',
        method: 'post',
        params,
    })
}


// 根据联锁号查询联锁恢复申请新增界面相关信息
export function queryByNoToRecover(params) {
    return requirt({
        url: '/InterlockApply/queryByNoToRecover',
        method: 'post',
        params,
    })
}

// 生成联锁申请中新增的序号
export function generatedNumber(params) {
    return requirt({
        url: '/InterlockApply/generatedNumber',
        method: 'get',
        params: params,
    })
}


// 编辑联锁管理台账信息
export function updateClain(params) {
    return requirt({
        url: '/InterlockManageLedger/update',
        method: 'post',
        data: params,
    })
}

// 批量删除联锁申请单条信息
export function deleteRelease(params) {
    return requirt({
        url: '/InterlockApply/deleteBatch',
        method: 'delete',
        data: params,
    })
}


// 联锁申请开启审批流程
export function applySubmit(params) {
    return requirt({
        url: '/InterlockApply/ApplySubmit',
        method: 'get',
        params: params,
    })
}

// 联锁申请开始审批
export function applyAudio(params) {
    return requirt({
        url: '/InterlockApply/applyAudio',
        method: 'get',
        params: params,
    })
}

// 联锁申请待执行操作
export function executeOperation(params) {
    return requirt({
        url: '/InterlockApply/executeOperation',
        method: 'get',
        params: params,
    })
}

// 联锁申请待确认操作
export function confirmOperation(params) {
    return requirt({
        url: '/InterlockApply/confirmOperation',
        method: 'get',
        params: params,
    })
}