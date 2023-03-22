import requirt from '@/utils/request'
// 


export function selectCount(params) {
  return requirt({
    url: '/LabourProtectionApply/selectCount',
    method: 'post',
    data: params,
  })
}

export function findAllList(params) {
  return requirt({
    url: '/LabourProtectionApply/findAllList',
    method: 'get',
    params: params,
  })
}

export function queryByID(params) {
  return requirt({
    url: '/LabourProtectionApply/queryByID',
    method: 'get',
    params: params,
  })
}

export function labourAdd(params) {
  return requirt({
    url: '/LabourProtectionApply/add',
    method: 'post',
    data: params,
  })
}

export function labourUpdate(params) {
  return requirt({
    url: '/LabourProtectionApply/update',
    method: 'post',
    data: params,
  })
}

export function deleteBatch(params) {
  return requirt({
    url: '/LabourProtectionApply/deleteBatch',
    method: 'DELETE',
    data: params,
  })
}

// 复制创建劳保用品申请信息
export function copyAndCreate(params) {
  return requirt({
    url: '/LabourProtectionApply/copyAndCreate',
    method: 'post',
    params
  })
}



