import requirt from '@/utils/request'

// 查询接口
export function getListForPage(params) {
    return requirt({
        url: '/pipelineExportDailyReport/getListForPage',
        method: 'post',
        data: params,
    })
}
// 根据id查询接口
export function getById(id) {
    return requirt({
        url: `/pipelineExportDailyReport/getById?id=${id}`,
        method: 'get',
    })
}
// 新增
// export function add(params) {
//     return requirt({
//         url: '/pipelineExportDailyReport/addWithAtt',
//         method: 'post',
//         data: params,
//     })
// }
export function add(params) {
    return requirt({
        url: '/pipelineExportDailyReport/add',
        method: 'post',
        data: params,
    })
}
// 修改
// export function update(params) {
//     return requirt({
//         url: '/pipelineExportDailyReport/updateWithAtt',
//         method: 'post',
//         data: params,
//     })
// }
export function update(params) {
    return requirt({
        url: '/pipelineExportDailyReport/update',
        method: 'post',
        data: params,
    })
}

// 删除
export function deleteSC(params) {
    return requirt({
        url: '/pipelineExportDailyReport/delete',
        method: 'delete',
        data: params,
    })
}
// 查询管道外输日报实际数据
export function queryGasEveryDay(params) {
    return requirt({
        url: '/pipelineExportDailyReport/queryGasEveryDay',
        method: 'get',
        params: params,
    })
}
// 查询管道外输日报年度累计数据
export function queryYearTot(params) {
    return requirt({
        url: '/pipelineExportDailyReport/queryYearTot',
        method: 'get',
        params: params,
    })
}

// 提交
export function pipelineExportDailyReportSubmit(params) {
    return requirt({
        url: '/pipelineExportDailyReport/pipelineExportDailyReportSubmit',
        method: 'get',
        params: { id: params },
    })
}
// 审批
export function equipmentAlterationAudio(params) {
    return requirt({
        url: '/pipelineExportDailyReport/equipmentAlterationAudio',
        method: 'get',
        params: params,
    })
}

