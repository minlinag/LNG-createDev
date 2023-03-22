import requirt from '@/utils/request'
/*****.....设备润滑类型 2022.8.11 刘豪东
 *
 *
 * *****/
// 获取列表
export function getList(params){
    return requirt({
        url: '/eqmlubricationManager/conditionQuery',
        method: 'get',
        params: params,
    })
}
// 添加列表
export function addList(params){
    return requirt({
        url: '/eqmlubricationManager/add',
        method: 'post',
        data: params,
    })
}

//修改列表
export function upDateList(params){
    return requirt({
        url: '/eqmlubricationManager/Update',
        method: 'post',
        data: params,
    })
}
//删除列表
export function deleteList(params){
    return requirt({
        url: '/eqmlubricationManager/delete',
        method: 'delete',
        data: params,
    })
}
//发布版本
export function addIssue(params){
    return requirt({
        url: '/eqmlubricationManager/issue',
        method: 'post',
        data: params,
    })
}
//查询版本
export function findTableList(params){
    return requirt({
        url: '/eqmlubricationManager/findVersionList',
        method: 'get',
        params: params,
    })
}
//查询版本
export function queryByEqmType(params){
    return requirt({
        url: '/eqmlubricationManager/queryByEqmType',
        method: 'get',
        params: params,
    })
}
