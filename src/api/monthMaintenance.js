import requirt from '@/utils/request'
// 判断是否能新增月度计划并查询对应数据
export function monthJudgment(params){
    return requirt({
        url: '/monthly/addJudge',
        method: 'get',
        params: params,
    })
}
// //列表查询月度计划
export function monthOption(params){
    return requirt({
        url: '/Sbjwxtz/findMonthList',
        method: 'get',
        params: params,
    })
}
// 通过月度计划查询详情
export function queryDetailsByMonthlyPlanNo(params){
    return requirt({
        url: '/monthly/findListByMonthPlanNo',
        method: 'get',
        params: params,
    })
}
//添加检维修计划
export function monthlyPost(params){
    return requirt({
        url: '/monthly/add',
        method: 'post',
        data: params,
    })
}
// 修改接口
export function monthlyPut(params){
    return requirt({
        url: '/monthly/edit',
        method: 'PUT',
        data:params
    })
}
// 删除
export function deleteMonthlyPlan(params){
    return requirt({
        url: '/monthly/deleteByIds',
        method: 'delete',
        data: params,
    })
}
//导出excel
export function exportExcel(params) {
    return requirt({
        url: '/monthly/exportExcel',
        method: 'get',
        params: params,
    })
}

//年度检维修计划下载导入模板-新增次年计划
export function importMode(params) {
    return requirt({
        url: '/monthly/downloadTemplate',
        method: 'get',
        params: params,
    })
}
//遍历年度---用于下拉框
export function traversePlanYear(params) {
    return requirt({
        url: '/monthly/traversePlanYear',
        method: 'get',
        params: params,
    })
}
// export function queryDetailsByAnnualPlanNo(params){
//     return requirt({
//         url: '/Annual/queryDetailsByAnnualPlanNo',
//         method: 'get',
//         params: params,
//     })
// }

