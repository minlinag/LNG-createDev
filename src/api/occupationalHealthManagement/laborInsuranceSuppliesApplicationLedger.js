import requirt from '@/utils/request'
// 

export function findAllList(params) {
  return requirt({
    url: '/LabourProtectionApplyLedger/findAllList',
    method: 'post',
    params,
  })
}

export function queryByID(params) {
  return requirt({
    url: '/LabourProtectionApplyLedger/queryByID',
    method: 'get',
    params: params,
  })
}

export function labourProtectionApplySubmit(params) {
  return requirt({
    url: '/LabourProtectionApplyLedger/labourProtectionApplySubmit',
    method: 'get',
    params: params,
  })
}

export function labourProtectionApplyAudio(params) {
  return requirt({
    url: '/LabourProtectionApplyLedger/labourProtectionApplyAudio',
    method: 'get',
    params: params,
  })
}

export function deleteBatch(params) {
  return requirt({
    url: '/LabourProtectionApplyLedger/deleteBatch',
    method: 'DELETE',
    data: params,
  })
}



