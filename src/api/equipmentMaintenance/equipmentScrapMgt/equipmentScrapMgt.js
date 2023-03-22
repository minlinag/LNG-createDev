import requirt from '@/utils/request'
// 获取列表
export function getList(data){
    return requirt({
        url:'/equipmentScrap/getListForPage',
        method:'post',
        data
    })
}
// 新增
export function saveData(data){
    return requirt({
        url:'/equipmentScrap/addJsonWithAtt',
        method:'post',
        data
    })
}
// 修改
export function editData(data){
    return requirt({
        url:'/equipmentScrap/updateJsonWithAtt',
        method:'post',
        data
    })
}
// 删除
export function deleteData(data){
    return requirt({
        url:'/equipmentScrap/deleteBatch',
        method:'delete',
        data
    })
}
// 审批 
export function approval(params){
    return requirt({
        url:'/equipmentScrap/equipmentScrapAudio',
        method:'get',
        params
    })
}
// 审批流程开始--提交
export function submit(params){
    return requirt({
        url:'/equipmentScrap/equipmentScrapSubmit',
        method:'get',
        params
    })
}
// 报废根据ID获取详情
export function getById(params){
    return requirt({
        url:'/equipmentScrap/getById',
        method:'get',
        params
    })
}