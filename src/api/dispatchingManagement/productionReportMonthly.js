import requirt from '@/utils/request'

//分页查询用户信息绑定记录
export function findAllList(params) {
    return requirt({
        url: '/ProductionMonthlyReportController/findAllList',
        method: 'get',
        params: params,
    })
}

//根据编号查询详情
export function queryDetailById(id) {
    return requirt({
        url: '/ProductionMonthlyReportController/queryDetailById',
        method: 'get',
        params: {"ID":id},
    })
}

//修改
export function update(params) {
    return requirt({
        url: '/ProductionMonthlyReportController',
        method: 'put',
        data: params,
    })
}

//开启流程
export function submit(id) {
    return requirt({
        url: '/ProductionMonthlyReportController/productionMonthlyReportSubmit',
        method: 'get',
        params: {id:id},
    })
}

//审批
export function approval(params) {
    return requirt({
        url: '/ProductionMonthlyReportController/productionMonthlyReportAudio',
        method: 'get',
        params: params,
    })
}