import requirt from '@/utils/request'
// 查询
export function findAllList(params) {
    return requirt({
        url: '/LoadingDailyReportController/findAllList',
        method: 'get',
        params: params,
    })
}

// 根据ID查询
export function queryById(id) {
    return requirt({
        url: `/LoadingDailyReportController/queryById?ID=${id}`,
        method: 'get',
    })
}

// 修改
export function update(params) {
    return requirt({
        url: '/LoadingDailyReportController/update',
        method: 'post',
        data: params,
    })
}
// 查询LNG累计量
export function statisticLNG(params) {
    return requirt({
        url: '/LoadingDailyReportController/statisticLNG',
        method: 'get',
        params: params,
    })
}
// 查询装车日报现场生产动态
export function queryOperationCondition(params) {
    return requirt({
        url: '/LoadingDailyReportController/queryOperationCondition',
        method: 'get',
        params: params,
    })
}
// 审批
export function AudioPass(params, auditStatus) {
    return requirt({
        url: '/LoadingDailyReportController/AudioPass?auditStatus=' + auditStatus,
        method: 'post',
        data: params,
    })
}

// 提交
export function submitForAddOrUpdate(id) {
    return requirt({
        url: `/LoadingDailyReportController/LoadingDailyReportSubmit?id=${id}`,
        method: 'get',
    })
}

// 审批
export function monthPlanAudio(params) {
    return requirt({
        url: '/LoadingDailyReportController/LoadingDailyReportAudio',
        method: 'get',
        params: params,
    })
}
