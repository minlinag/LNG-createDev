import requirt from '@/utils/request'
// 
// 设备技术参数查询
export function findAllList(params) {
  return requirt({
    url: '/DeviceTechnicalParameterController/findAllList',
    method: 'get',
    params: params,
  })
}
// 设备技术参数修改
export function paramsUpdate(params) {
  return requirt({
    url: '/DeviceTechnicalParameterController/update',
    method: 'post',
    data: params,
  })
}

// 设备技术参数新增
export function paramsInsert(params) {
  return requirt({
    url: '/DeviceTechnicalParameterController/insertBatch',
    method: 'post',
    data: params,
  })
}

