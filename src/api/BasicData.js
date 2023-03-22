import requirt from '@/utils/request'

//查询
export function getListForPage(params) {
    return requirt({
        url: '/productionOperationBasicInfo/getListForPage',
        method: 'post',
        data: params,
    })
}
// 新增
export function add(params) {
    return requirt({
        url: '/productionOperationBasicInfo/add',
        method: 'post',
        data: params,
    })
}
// 修改
export function update(params) {
    return requirt({
        url: '/productionOperationBasicInfo/update',
        method: 'post',
        data: params,
    })
}
// 删除
export function deleteSC(params) {
    return requirt({
        url: '/productionOperationBasicInfo/delete',
        method: 'DELETE',
        data: params,
    })
}


