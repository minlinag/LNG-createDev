import requirt from '@/utils/request'
// 查询
export function getListForPage(params) {
    return requirt({
        url: '/LoadingRecord/findAllList',
        method: 'get',
        params: params,
    })
}
// 查询详情
export function queryById(params) {
    return requirt({
        url: '/LoadingRecord/queryById',
        method: 'get',
        params: params,
    })
}
// 查询装车记录承运商下拉框信息
export function queryCarrierName(params) {
    return requirt({
        url: 'customerCarrier/getIdAndNameList',
        method: 'post',
        params: params,
    })
}
