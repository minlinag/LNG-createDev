import requirt from '@/utils/request'
// 
export function findAllList(params) {
  return requirt({
    url: '/DeviceDefectTableController/findAllList',
    method: 'get',
    params: params,
  })
}

export function StatisticAmountUntreated(params) {
  return requirt({
    url: '/DeviceDefectTableController/StatisticAmountUntreated',
    method: 'get',
    params: params,
  })
}

export function StatisticAmount(params) {
  return requirt({
    url: '/DeviceDefectTableController/StatisticAmount',
    method: 'get',
    params: params,
  })
}
