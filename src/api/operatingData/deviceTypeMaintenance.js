import request from '@/utils/request'

// /DeviceTypeMaintain/findAllList 含分页条件查询设备类型维护信息

export function findAllList(params) {
  return request({
    url: '/DeviceTypeMaintain/findAllList',
    method: 'get',
    params: params,
  })
}

// /DeviceTypeMaintain/insert 新增设备类型维护信息
export function insert(data) {
  return request({
    url: '/DeviceTypeMaintain/insert',
    method: 'post',
    data
  })
}

// /DeviceTypeMaintain/update  修改设备类型维护信息
export function update(data) {
  return request({
    url: '/DeviceTypeMaintain/update',
    method: 'post',
    data
  })
}

// /DeviceTypeMaintain/deleteBatch  删除设备类型维护信息
export function deleteBatch(data) {
  return request({
    url: '/DeviceTypeMaintain/deleteBatch',
    method: 'delete',
    data
  })
}