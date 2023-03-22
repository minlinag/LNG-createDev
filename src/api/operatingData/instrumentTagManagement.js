import request from '@/utils/request'

// /InstrumentNoMaintain/findAllList 含分页条件查询仪表位号维护信息

export function findAllList(params) {
  return request({
    url: '/InstrumentNoMaintain/findAllList',
    method: 'get',
    params: params,
  })
}

// /InstrumentNoMaintain/insertBatch 仪表位号维护功能
export function insertBatch(data) {
  return request({
    url: '/InstrumentNoMaintain/insertBatch',
    method: 'post',
    data
  })
}

// /InstrumentNoMaintain/update  修改仪表位号维护信息
export function update(data) {
  return request({
    url: '/InstrumentNoMaintain/update',
    method: 'post',
    data
  })
}

// /InstrumentNoMaintain/deleteBatch  删除仪表位号维护信息
export function deleteBatch(data) {
  return request({
    url: '/InstrumentNoMaintain/deleteBatch',
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

// /InstrumentNoMaintain/queryByID  根据ID查询仪表位号维护信息
export function queryByID(params) {
  return request({
    url: '/InstrumentNoMaintain/queryByID',
    method: 'get',
    params
  })
}

// /InstrumentNoMaintain/queryMaintainData 查询仪表位号维护类别信息——用于新增维护
export function queryMaintainData(params) {
  return request({
    url: '/InstrumentNoMaintain/queryMaintainData',
    method: 'get',
    params
  })
}


// /mdm/featureClassific/queryTree 查询特征分类树
export function queryTree(params) {
  return request({
    url: '/mdm/featureClassific/queryTree',
    method: 'get',
    params
  })
}

// /mdm/characterMaster/queryListForClass 设备表头名称
export function queryListForClass(params) {
  return request({
    url: '/mdm/characterMaster/queryListForClass',
    method: 'get',
    params
  })
}

// /mdm/eqmMasterData/pageList 设备列表
export function pageList(data) {
  return request({
    url: '/mdm/eqmMasterData/pageList',
    method: 'post',
    data
  })
}

