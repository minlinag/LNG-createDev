import requirt from '@/utils/request'

/**
 * 查询
 */
export function list(params) {
    return requirt({
        url: '/jjb/getListForPage',
        method: 'post',
        data:params
    })
}
/**
 * 新增
 */
export function saveData(params) {
    return requirt({
        url: '/jjb/insert',
        method: 'post',
        data:params
    })
}
/**
 * 编辑
 */
export function editData(params) {
    return requirt({
        url: '/jjb/update',
        method: 'post',
        data:params
    })
}

/**
 * 删除
 */
export function deleteData(params) {
    return requirt({
        url: '/jjb/delete',
        method: 'delete',
        data:params
    })
}