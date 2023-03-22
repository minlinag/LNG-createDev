import request from '@/utils/request'

// 岗位职责-列表
export function postManagementFindAllList(params) {
  return request({
    url: '/PostManagement/findAllList',
    method: 'get',
    params
  })
}

// 岗位职责-新增
export function postManagementInsert(data) {
  return request({
    url: '/PostManagement/insert',
    method: 'post',
    data
  })
}

// 岗位职责-详情
export function postManagementQueryByID(params) {
  return request({
    url: '/PostManagement/queryByID',
    method: 'get',
    params
  })
}

// 岗位职责-编辑
export function postManagementUpdateMain(data) {
  return request({
    url: '/PostManagement/updateMain',
    method: 'post',
    data
  })
}

// 岗位职责-删除
export function postManagementDeleteBatch(data) {
  return request({
    url: '/PostManagement/deleteBatch',
    method: 'delete',
    data
  })
}

// 人员责任制考核-列表
export function personnelExamineFindAllList(params) {
  return request({
    url: '/PersonnelExamine/findAllList',
    method: 'get',
    params
  })
}

// 人员责任制考核-生成编号最后三位
export function personnelExamineSelectCount(data) {
  return request({
    url: '/PersonnelExamine/selectCount',
    method: 'post',
    data
  })
}

// 人员责任制考核-查询岗位名称列表
export function personnelExamineQueryPostName(data) {
  return request({
    url: '/PersonnelExamine/queryPostName',
    method: 'post',
    data
  })
}

// 人员责任制考核-获取岗位责任
export function personnelExamineSelectPostDutyData(params) {
  return request({
    url: '/PersonnelExamine/selectPostDutyData',
    method: 'get',
    params
  })
}
// 人员责任制考核-新增信息
export function personnelExamineInsert(data) {
  return request({
    url: '/PersonnelExamine/insert',
    method: 'post',
    data
  })
}

// 人员责任制考核-编辑信息
export function personnelExamineUpdate(data) {
  return request({
    url: '/PersonnelExamine/update',
    method: 'post',
    data
  })
}

// 人员责任制考核-新增考核记录信息
export function personnelExamineInsertAssess(data) {
  return request({
    url: '/PersonnelExamine/insertAssess',
    method: 'post',
    data
  })
}

// 人员责任制考核-编辑考核记录信息
export function personnelExamineUpdateAssess(data) {
  return request({
    url: '/PersonnelExamine/updateAssess',
    method: 'post',
    data
  })
}

// 人员责任制考核-单条信息
export function personnelExamineQueryByID(params) {
  return request({
    url: '/PersonnelExamine/queryByID',
    method: 'get',
    params
  })
}

// 人员责任制考核-考核记录单条信息
export function personnelExamineQueryAssessByID(params) {
  return request({
    url: '/PersonnelExamine/queryAssessByID',
    method: 'get',
    params
  })
}

// 人员责任制考核-删除考核记录信息
export function personnelExamineDeleteBatchAssess(data) {
  return request({
    url: '/PersonnelExamine/deleteBatchAssess',
    method: 'delete',
    data
  })
}
// 人员责任制考核-删除信息
export function personnelExamineDeleteBatch(data) {
  return request({
    url: '/PersonnelExamine/deleteBatch',
    method: 'delete',
    data
  })
}
