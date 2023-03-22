import requirt from '@/utils/request'
// 获取申请单列表
export function getList(params){
    return requirt({
        url:'/customerVehicle/getListForPage',
        method:'post',
        data:params,
    })
}

// 根据ID查详情
export function selectByID(id){
    return requirt({
        url:`/customerVehicle/selectByID?id=${id}`,
        method:'get',
    })
}

// 加入黑名单
export function addBlacklist(params){
  return requirt({
      url:'/customerVehicle/addBlacklist',
      method:'post',
      data:params,
  })
}

// 审核通过
export function approval(id,opinion){
    return requirt({
        url:'/customerVehicle/approval',
        method:'post',
        params: {id:id,opinion:opinion},
    })
}

// 根据id查询文件
export function queryFileByParentId(strParentId){
    return requirt({
        url:'/customerVehicleDoc/queryByParentId',
        method:'get',
        params:{'strParentId':strParentId},
   })
}
