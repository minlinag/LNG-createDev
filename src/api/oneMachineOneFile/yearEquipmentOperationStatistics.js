import requirt from '@/utils/request'
// 
export function findAllList(params) {
  return requirt({
    url: '/DeviceOperationTableController/findAllList',
    method: 'get',
    params: params,
  })
}

export function staticAccumulateTotal(params) {
  return requirt({
    url: '/DeviceOperationTableController/staticAccumulateTotal',
    method: 'get',
    params: params,
  })
}
