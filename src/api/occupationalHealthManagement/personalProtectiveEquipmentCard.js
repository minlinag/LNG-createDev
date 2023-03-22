import requirt from '@/utils/request'
// 

export function findAllList(params) {
  return requirt({
    url: '/PersonalProtectionCard/findAllList',
    method: 'post',
    params,
  })
}


export function queryByID(params) {
  return requirt({
    url: '/PersonalProtectionCard/queryByID',
    method: 'get',
    params: params,
  })
}

