import requirt from '@/utils/request'


// 字典表树状结构数据
export function getTree(params) {
    return requirt({
        url: '/dict/getTreeAjgl?dictId=AJXPZ',
        method: 'get',
        // params: params,
    })
}

// 查询
export function findAllListByNodeID(params) {
    return requirt({
        url: '/tankcarajxpz/findAllListByNodeID',
        method: 'get',
        params: params,
    })
}
// 字典表树状结构新增
export function addDict(params) {
    return requirt({
        url: '/dict/addDictFX',
        method: 'post',
        data: params,
    })
}
// 新增
export function add(params) {
    return requirt({
        url: '/tankcarajxpz/add',
        method: 'post',
        data: params,
    })
}
// 修改
export function updateByID(params) {
    return requirt({
        url: '/tankcarajxpz/updateByID',
        method: 'post',
        data: params,
    })
}
// 是否启用 
export function enableOrShutdown(params) {
    return requirt({
        url: '/tankcarajxpz/enableOrShutdown',
        method: 'post',
        data: params,
    })
}
// 删除
export function deleteByID(params) {
    return requirt({
        url: '/tankcarajxpz/deleteByID',
        method: 'delete',
        params: params,
    })
}
// 删除
export function deleteDict(params) {
    return requirt({
        url: '/dict/deleteDict',
        method: 'delete',
        data: params,
    })
}
// 导航栏查询
export function dictList(params) {
    return requirt({
        url: '/dict/dictList',
        method: 'get',
        params: params,
    })
}
// 修改导航栏  
export function updateDict(params) {
    return requirt({
        url: '/dict/updateDict',
        method: 'put',
        data: params,
    })
}
// 修改导航栏顺序
export function sortTreeByIds(params) {
    return requirt({
        url: '/dict/sortTreeByIds',
        method: 'post',
        data: params,
    })
}
// 安检项排序
export function sortAjByIds(params) {
    return requirt({
        url: '/tankcarajxpz/sortAjByIds',
        method: 'post',
        data: params,
    })
}

