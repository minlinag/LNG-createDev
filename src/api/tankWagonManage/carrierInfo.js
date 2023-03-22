import requirt from '@/utils/request'
// 获取承运商列表
export function getList(params){
    return requirt({
        url:'/customerCarrier/getListForPage',
        method:'post',
        data:params,
    })
}
// 根据id查承运商详情
export function selectByID(id){
    return requirt({
        url:`/customerCarrier/selectByID?id=${id}`,
        method:'get',
    })
}

 

// 加入黑名单
export function addBlacklist(params){
  return requirt({
      url:'/customerCarrier/addBlacklist',
      method:'post',
      data:params,
  })
}

// 审核通过
export function approval(id,opinion){
    return requirt({
        url:'/customerCarrier/approval',
        method:'post',
        params: {id:id,opinion:opinion},
    })
}

// 根据id查询文件
export function queryFileByParentId(strParentId){
    return requirt({
        url:'/customerCarrierDoc/queryByParentId',
        method:'get',
        params:{'strParentId':strParentId},
   })
}
