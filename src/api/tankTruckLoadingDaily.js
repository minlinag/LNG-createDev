import requirt from '@/utils/request'

// 查询接口
export function findList(params) {
    return requirt({
        url: '/cczcrb/findList',
        method: 'get',
        params: params,
    })
}
// 根据id查询详情
export function findById(params) {
    return requirt({
        url: '/cczcrb/findById',
        method: 'get',
        params: params,
    })
}

// 新增
// export function add(params) {
//     return requirt({
//         url: '/cczcrb/addWithAtt',
//         method: 'post',
//         data: params,
//     })
// }
export function add(params) {
    return requirt({
        url: '/cczcrb/add',
        method: 'post',
        data: params,
    })
}
// 修改
// export function editById(params) {
//     return requirt({
//         url: '/cczcrb/updateWithAtt',
//         method: 'post',
//         data: params,
//     })
// }
export function editById(params) {
    return requirt({
        url: '/cczcrb/editById',
        method: 'post',
        data: params,
    })
}
// 删除
export function deleteByIds(params) {
    return requirt({
        url: '/cczcrb/deleteByIds',
        method: 'delete',
        data: params,
    })
}
// 查询字表数据
export function queryDailyGasAmount(params) {
    return requirt({
        url: 'LoadingRecord/queryDailyGasAmount',
        method: 'get',
        params: params,
    })
}
// 提交
export function loadingDailySubmit(params) {
    return requirt({
        url: '/cczcrb/loadingDailySubmit',
        method: 'get',
        params: { id: params },
    })
}
export function submitAndSign(params) {
    return requirt({
        url: '/cczcrb/submitAndSign',
        method: 'post',
        data: params,
    })
}


// 审批
export function loadingDailyAudio(params) {
    return requirt({
        url: '/cczcrb/loadingDailyAudio',
        method: 'get',
        params: params,
    })
}

export function audioAndSign(params) {
    return requirt({
        url: '/cczcrb/audioAndSign',
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

//  电子签章
export function queryImageByIdNumberForStr(params) {
    return requirt({
        url: '/ca/queryImageByIdNumberForStr',
        method: 'get',
        params: params,
    })
}
