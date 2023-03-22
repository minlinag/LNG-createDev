import requirt from '@/utils/request'
// 

export function findAllList(params) {
  return requirt({
    url: '/TEqmSbmpxxController/findAllList',
    method: 'get',
    params: params,
  })
}

export function tEqmSbmpxxControllerAdd(params) {
  return requirt({
    url: '/TEqmSbmpxxController/update',
    method: 'post',
    data: params,
  })
}

export function TEqmSbmpxxControllerUpdate(params) {
  return requirt({
    url: '/TEqmSbmpxxController/update',
    method: 'post',
    data: params,
  })
}

