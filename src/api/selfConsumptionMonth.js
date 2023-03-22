import requirt from '@/utils/request'
//查询
export function findAllList(params) {
    return requirt({
        url: '/SelfConsumeGasMonthReportController/findAllList',
        method: 'get',
        params: params,
    })
}

//根据ID查询
export function getById(id) {
    return requirt({
        url: `/SelfConsumeGasMonthReportController/getById?id=${id}`,
        method: 'get',
    })
}
// 新增
// export function insert(params) {
//     return requirt({
//         url: '/SelfConsumeGasMonthReportController/insertWithAtt',
//         method: 'post',
//         data: params
//     })
// }
export function insert(params) {
    return requirt({
        url: '/SelfConsumeGasMonthReportController/insert',
        method: 'post',
        data: params
    })
}
// 修改
// export function update(params) {
//     return requirt({
//         url: '/SelfConsumeGasMonthReportController/updateWithAtt',
//         method: 'post',
//         data: params
//     })
// }
export function update(params) {
    return requirt({
        url: '/SelfConsumeGasMonthReportController/update',
        method: 'post',
        data: params
    })
}
// 删除
export function deleteSC(params) {
    return requirt({
        url: '/SelfConsumeGasMonthReportController/delete',
        method: 'delete',
        data: params
    })
}
// 提交
export function selfCosGasMonthRepSubmit(params) {
    return requirt({
        url: '/SelfConsumeGasMonthReportController/selfCosGasMonthRepSubmit',
        method: 'get',
        params: { id: params },
    })
}

// 审批
export function selfCosGasMonthRepAudio(params) {
    return requirt({
        url: '/SelfConsumeGasMonthReportController/selfCosGasMonthRepAudio',
        method: 'get',
        params: params,
    })
}

//查询字表信息
export function querySelfConsumeDailyData(params) {
    return requirt({
        url: 'SelfConsumeGasMonthReportController/querySelfConsumeDailyData',
        method: 'get',
        params: params,
    })
}

