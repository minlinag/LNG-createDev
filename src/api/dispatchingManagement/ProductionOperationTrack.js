import requirt from '@/utils/request'

//分页查询用户信息绑定记录
export function findAllListByYear(params) {
    return requirt({
        url: '/findYearPlan',
        method: 'post',
        params: params,
    })
}
//分页查询用户信息绑定记录
export function findAllListByMonth(params) {
    return requirt({
        url: '/findMonthPlan',
        method: 'post',
        params: params,
    })
}
//查询年份
export function selectYearList() {
    return requirt({
        url: '/selectYearList',
        method: 'post',
        // data: params,
    })
}