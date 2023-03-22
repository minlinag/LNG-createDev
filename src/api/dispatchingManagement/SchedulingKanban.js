import requirt from '@/utils/request'

//查询当日外输详情
export function queryTodayDetail(params) {
    return requirt({
        url: '/po/sm/transportBoard/queryTodayDetail',
        method: 'get',
        params: params,
    })
}

//查询30日外输详情
export function queryMonDetail(params) {
    return requirt({
        url: '/po/sm/transportBoard/queryMonDetail',
        method: 'get',
        params: params,
    })
}

//年度指标完成情况
export function queryYearData(params) {
    return requirt({
        url: '/po/sm/transportBoard/queryYearData',
        method: 'get',
        params: params,
    })
}