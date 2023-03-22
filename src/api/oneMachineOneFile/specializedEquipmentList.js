import requirt from '@/utils/request'
// 
export function findAllList(params) {
  return requirt({
    url: '/ProfessionalToolTableController/findAllList',
    method: 'get',
    params: params,
  })
}

export function deleteBatch(params) {
  return requirt({
    url: '/ProfessionalToolTableController/deleteBatch',
    method: 'DELETE',
    data: params,
  })
}

export function professionalToolTableControllerAdd(params) {
  return requirt({
    url: '/ProfessionalToolTableController/add',
    method: 'post',
    data: params,
  })
}
export function professionalToolTableControllerUpdate(params) {
  return requirt({
    url: '/ProfessionalToolTableController/update',
    method: 'post',
    data: params,
  })
}