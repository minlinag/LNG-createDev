import requirt from '@/utils/request'
// 
export function findAllList(params) {
  return requirt({
    url: '/AccessoryEquipmentTableController/findAllList',
    method: 'get',
    params: params,
  })
}

export function deleteBatch(params) {
  return requirt({
    url: '/AccessoryEquipmentTableController/deleteBatch',
    method: 'DELETE',
    data: params,
  })
}

export function accessoryEquipmentTableControllerAdd(params) {
  return requirt({
    url: '/AccessoryEquipmentTableController/add',
    method: 'post',
    data: params,
  })
}
export function accessoryEquipmentTableControllerUpdate(params) {
  return requirt({
    url: '/AccessoryEquipmentTableController/update',
    method: 'post',
    data: params,
  })
}



