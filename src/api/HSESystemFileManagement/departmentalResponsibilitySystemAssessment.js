import request from '@/utils/request'
// 部门责任制考核-列表
export function personnelExamineFindAllList(params) {
  return request({
    url: '/DepartmentExamine/findAllList',
    method: 'get',
    params
  })
}

// 部门责任制考核-查询岗位名称列表
export function personnelExamineQueryPostName(data) {
  return request({
    url: '/DepartmentExamine/queryPostName',
    method: 'post',
    data
  })
}

// 部门责任制考核-获取岗位责任
export function personnelExamineSelectPostDutyData(params) {
  return request({
    url: '/DepartmentExamine/selectDataByPostName',
    method: 'get',
    params
  })
}

// 部门责任制考核-新增信息
export function personnelExamineInsert(data) {
  return request({
    url: '/DepartmentExamine/insert',
    method: 'post',
    data
  })
}

// 部门责任制考核-新增考核记录信息
export function personnelExamineInsertAssess(data) {
  return request({
    url: '/DepartmentExamine/insertRecord',
    method: 'post',
    data
  })
}

// 部门责任制考核-编辑考核记录信息
export function personnelExamineUpdateAssess(data) {
  return request({
    url: '/DepartmentExamine/updateRecord',
    method: 'post',
    data
  })
}

// 部门责任制考核-单条信息
export function personnelExamineQueryByID(params) {
  return request({
    url: '/DepartmentExamine/queryByID',
    method: 'get',
    params
  })
}


// 部门责任制考核-考核记录单条信息
export function personnelExamineQueryAssessByID(params) {
  return request({
    url: '/DepartmentExamine/queryRecordByID',
    method: 'get',
    params
  })
}

// 部门责任制考核-删除信息
export function personnelExamineDeleteBatch(data) {
  return request({
    url: '/DepartmentExamine/deleteBatch',
    method: 'delete',
    data
  })
}

// 部门责任制考核-删除考核记录信息
export function personnelExamineDeleteBatchAssess(data) {
  return request({
    url: '/DepartmentExamine/deleteBatchAssess',
    method: 'delete',
    data
  })
}
