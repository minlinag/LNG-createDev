import requirt from '@/utils/request'

// 含分页查询联锁管理台账信息
export function findAllList(params){
    return requirt({
        url:'/InterlockManageLedger/findAllList',
        method:'get',
        params:params,
    })
}

// 新增联锁管理台账信息
export function insertClain(params){
    return requirt({
        url:'/InterlockManageLedger/insert',
        method:'post',
        data:params,
    })
}

// 编辑联锁管理台账信息
export function updateClain(params){
    return requirt({
        url:'/InterlockManageLedger/update',
        method:'post',
        data:params,
    })
}

// 批量删除联锁管理台账信息
// export function deleteClain(params){
//     return requirt({
//         url: '/InterlockManageLedger/deleteBatch',
//         method: 'delete',
//         data: params,
//     })
// }

// 批量删除联锁管理台账信息
export function deleteClain(params){
    return requirt({
        url: '/InterlockManageLedger/delete',
        method: 'delete',
        data: params,
    })
}
// 根据id查询单条信息
export function queryByID(params){
    return requirt({
        url:'/InterlockManageLedger/queryByID',
        method:'get',
        params:params,
    })
}


// 导出联锁管理台账为Excel
export function exportAccount(params){
    return requirt({
        url:'/InterlockManageLedger/exportExcel',
        method:'get',
        params:params,
    })
}