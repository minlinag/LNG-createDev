import requirt from '@/utils/request'
//查询
export function findAllList(params) {
    return requirt({
        url: '/SelfConsumeGasDailyReport/findAllList',
        method: 'get',
        params: params,
    })
}