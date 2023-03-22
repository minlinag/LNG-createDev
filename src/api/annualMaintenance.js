import requirt from '@/utils/request'
//通过年份获得每年的年度计划大体情况（每年只有一条记录
export function yearOption(params) {
    return requirt({
        url: '/Annual/queryItemByYear',
        method: 'get',
        params: params,
    })
}

//添加检维修计划
export function addAnnualInspectionPlan(params) {
    return requirt({
        url: '/Annual/addAnnualInspectionPlan',
        method: 'post',
        data: params,
    })
}
//通过年度计划编码查询年度计划细节
export function queryDetailsByAnnualPlanNo(params) {
    return requirt({
        url: '/Annual/queryDetailsByAnnualPlanNo',
        method: 'get',
        params: params,
    })
}
//删除年度计划编码
export function deleteAnnualInspectionPlan(params) {
    return requirt({
        url: '/Annual/deleteAnnualInspectionPlan',
        method: 'delete',
        data: params,
    })
}
//导出excel
export function exportExcel(params) {
    return requirt({
        url: '/Annual/exportExcel',
        method: 'get',
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
