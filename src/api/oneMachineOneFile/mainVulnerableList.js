import requirt from '@/utils/request'
// 
export function findAllList(params) {
  return requirt({
    url: '/MainAndDamagePartsController/findAllList',
    method: 'get',
    params: params,
  })
}

export function deleteBatch(params) {
  return requirt({
    url: '/MainAndDamagePartsController/deleteBatch',
    method: 'DELETE',
    data: params,
  })
}

export function MainAndDamagePartsControllerAdd(params) {
  return requirt({
    url: '/MainAndDamagePartsController/add',
    method: 'post',
    data: params,
  })
}
export function MainAndDamagePartsControllerUpdate(params) {
  return requirt({
    url: '/MainAndDamagePartsController/update',
    method: 'post',
    data: params,
  })
}



