import request from '@/utils/request'

// 查询HSE体系文件
export function getListForPage(data) {
    return request({
        url: '/czgcgl/getListForPage',
        method: 'post',
        data
    })
}

// HSE体系文件-新增
export function hseFileInsert(data) {
    return request({
        url: '/czgcgl/insert',
        method: 'post',
        data
    })
}


// 修改HSE体系文件数据
export function hseFileUpdate(data) {
    return request({
        url: '/czgcgl/update',
        method: 'post',
        data
    })
}

// 删除HSE体系文件数据
export function hseFileDelete(data) {
    return request({
        url: '/czgcgl/delete',
        method: 'delete',
        data
    })
}
