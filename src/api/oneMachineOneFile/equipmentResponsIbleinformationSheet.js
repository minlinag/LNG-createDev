import requirt from '@/utils/request'
// 
export function findAllList(params) {
  return requirt({
    url: '/DeviceManagePrincipalController/findAllList',
    method: 'get',
    params: params,
  })
}


export function DeviceManagePrincipalControllerAdd(params) {
  return requirt({
    url: '/DeviceManagePrincipalController/add',
    method: 'post',
    data: params,
  })
}

export function deleteBatch(params) {
  return requirt({
    url: '/DeviceManagePrincipalController/deleteBatch',
    method: 'DELETE',
    data: params,
  })
}
