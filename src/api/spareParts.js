import requirt from '@/utils/request'
/*****.....临时检修计划 2022.8.24刘豪东
 *
 *
 * *****/
// 获取列表
export function getList(params){
    return requirt({
        url: '/bpbjqd/getListForPage',
        method: 'post',
        data: params,
    })
}
// 修改列表数据
export function updataList(params){
    return requirt({
        url: '/bpbjqd/updateSafetyStockById',
        method: 'get',
        params: params,
    })
}
// 修改列表数据
export function getTreeList(params){
    return requirt({
        url: '/mdm/featureClassific/queryTree',
        method: 'get',
        params: params,
    })
}
