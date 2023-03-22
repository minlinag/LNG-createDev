import requirt from '@/utils/request'
// 获取申请单列表
export function getTableList(params){
    return requirt({
        url:'/overhaulPlanController/getListForPage',
        method:'post',
        data:params,
    })
}

// 新增列表
export function addList(params){
    return requirt({
        url:'/overhaulPlanController/addJsonWithAtt',
        method:'post',
        data:params,
    })
}

// 新增直接提交
// export function addList(params){
//     return requirt({
//         url:'/overhaulPlanController/addJsonWithAtt',
//         method:'post',
//         data:params,
//     })
// }

// 修改列表
export function updataLists(params){
    return requirt({
        url:'/overhaulPlanController/updateJsonWithAtt',
        method:'post',
        data:params,
    })
}

// 删除列表
export function deleteList(params){
  return requirt({
      url:'/overhaulPlanController/deleteBatch',
      method:'delete',
      data:params,
  })
}
