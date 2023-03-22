import request from '@/utils/request'

// /TestPointTypeMaintain/findAllList 含分页条件查询测点类别维护信息

export function findAllList(params) {
  return request({
    url: '/TestPointTypeMaintain/findAllList',
    method: 'get',
    params: params,
  })
}

// /TestPointTypeMaintain/insert 新增测点类别维护信息
export function insert(data) {
  return request({
    url: '/TestPointTypeMaintain/insert',
    method: 'post',
    data
  })
}

// /TestPointTypeMaintain/update  修改测点类别维护信息
export function update(data) {
  return request({
    url: '/TestPointTypeMaintain/update',
    method: 'post',
    data
  })
}

// /TestPointTypeMaintain/deleteBatch  删除测点类别维护信息
export function deleteBatch(data) {
  return request({
    url: '/TestPointTypeMaintain/deleteBatch',
    method: 'delete',
    data
  })
}

// /TestPointTypeMaintain/queryDeviceClassList 查询设备类别
export function queryDeviceClassList(params) {
  return request({
    url: '/TestPointTypeMaintain/queryDeviceClassList',
    method: 'get',
    params
  })
}

// /TestPointTypeMaintain/queryByID  根据ID查询测点类别维护信息
export function queryByID(params) {
  return request({
    url: '/TestPointTypeMaintain/queryByID',
    method: 'get',
    params
  })
}