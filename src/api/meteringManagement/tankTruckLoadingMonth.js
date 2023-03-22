import requirt from '@/utils/request'

// 查询接口
export function findList(params) {
    return requirt({
        url: '/cczcyb/findList',
        method: 'get',
        params: params,
    })
}
// 新增
// export function add(params) {
//     return requirt({
//         url: '/cczcyb/addWithAtt',
//         method: 'post',
//         data: params,
//     })
// }
export function add(params) {
    return requirt({
        url: '/cczcyb/add',
        method: 'post',
        data: params,
    })
}
// 修改
// export function editById(params) {
//     return requirt({
//         url: '/cczcyb/updateWithAtt',
//         method: 'post',
//         data: params,
//     })
// }
export function editById(params) {
    return requirt({
        url: '/cczcyb/editById',
        method: 'post',
        data: params,
    })
}
// 删除
export function deleteByIds(params) {
    return requirt({
        url: '/cczcyb/deleteByIds',
        method: 'delete',
        data: params,
    })
}

// 查详情
export function findById(id) {
    return requirt({
        url: `/cczcyb/findById?id=${id}`,
        method: 'get',
    })
}

// 
// 槽车外输计量中的每日供气量
export function queryGasEveryDay(params) {
    return requirt({
        url: '/LoadingRecord/queryGasEveryDay',
        method: 'get',
        params: params,
    })
}
// 槽车外输计量中的年累计供气
export function queryGasStartDay(params) {
    return requirt({
        url: '/LoadingRecord/queryGasStartDay',
        method: 'get',
        params: params,
    })
}

// 提交
export function CczcybSubmit(params) {
    return requirt({
        url: '/cczcyb/cczcybSubmit',
        method: 'get',
        params: { id: params },
    })
}

export function submitAndSign(params) {
    return requirt({
        url: '/cczcyb/submitAndSign',
        method: 'post',
        data: params,
    })
}


// 审批
export function coldEnergyConsumAudio(params) {
    return requirt({
        url: '/cczcyb/coldEnergyConsumAudio',
        method: 'get',
        params: params,
    })
}

export function audioAndSign(params) {
    return requirt({
        url: '/cczcyb/audioAndSign',
        method: 'post',
        data: params,
    })
}

export function getBase64StrByBusiness(params) {
    return requirt({
        url: '/fileinfo/getBase64StrByBusiness',
        method: 'get',
        data: params,
    })
}
