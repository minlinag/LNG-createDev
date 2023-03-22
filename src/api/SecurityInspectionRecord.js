import requirt from '@/utils/request'
// 查询
export function getListForPage(params) {
    return requirt({
        url: '/lngSales/selectAllCheckRecord',
        method: 'get',
        params: params,
    })
}
// 检查确认查询
export function selectJcxxByCodeAndCheck(params) {
    return requirt({
        url: '/lngSales/selectJcxxByCodeAndCheck',
        method: 'get',
        params: params,
    })
}