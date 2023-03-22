import requirt from '@/utils/request'
// 获取列表
export function getList(data){
    return requirt({
        url:'/equipmentDismantle/getListForPage',
        method:'post',
        data
    })
}
// 新增
export function saveData(data){
    return requirt({
        url:'/equipmentDismantle/addJsonWithAtt',
        method:'post',
        data
    })
}
// 修改
export function editData(data){
    return requirt({
        url:'/equipmentDismantle/updateJsonWithAtt',
        method:'post',
        data
    })
}
// 修改
export function editDispatData(data){
    return requirt({
        url:'/equipmentDismantle/update',
        method:'post',
        data
    })
}
// 删除
export function deleteData(data){
    return requirt({
        url:'/equipmentDismantle/deleteBatch',
        method:'delete',
        data
    })
}
// 审批 
export function approval(params){
    return requirt({
        url:'/equipmentDismantle/equipmentDismantleAudio',
        method:'get',
        params
    })
}
// 审批流程开始--提交
export function submit(params){
    return requirt({
        url:'/equipmentDismantle/equipmentDismantleSubmit',
        method:'get',
        params
    })
}
// 部门列表
export function dictList(params){
    return requirt({
        url:'/dict/dictList/LBSQ_SSBM',
        method:'get',
        params
    })
}
// 拆除根据ID获取详情
export function getById(params){
    return requirt({
        url:'/equipmentDismantle/getById',
        method:'get',
        params
    })
}