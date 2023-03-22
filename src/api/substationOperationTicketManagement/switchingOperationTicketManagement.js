import request from '@/utils/request'

// 倒闸操作票列表
export function getListForPage(data) {
  return request({
    url: '/bdzdz/getListForPage',
    method: 'post',
    data
  })
}

// 新增倒闸操作票
export function insert(data) {
  return request({
    url: '/bdzdz/insert',
    method: 'post',
    data
  })
}

// 生成倒闸操作票编号
export function createNewId(data) {
  return request({
    url: '/bdzdz/createNewId',
    method: 'post',
    data
  })
}

// 根据id查询倒闸操作票
export function selectByID(data) {
  return request({
    url: '/bdzdz/selectByID',
    method: 'post',
    data
  })
}

// 修改倒闸操作票
export function update(data) {
  return request({
    url: '/bdzdz/update',
    method: 'post',
    data
  })
}

// /bdzdz/delete 删除倒闸操作票
export function deleteByID(data) {
  return request({
    url: '/bdzdz/delete',
    method: 'delete',
    data
  })
}

// 获取外委单位下拉项信息
export function companySelect(params) {
  return request({
    url: '/wwdwgl/getCompanyInfo',
    method: 'get',
    params: params,
  })
}

// 申请开启审批流程
export function applySubmit(params) {
  return request({
    url: '/bdzdz/ApplySubmit',
    method: 'get',
    params
  })
}

// 申请开启审批
export function applyAudio(params) {
  return request({
    url: '/bdzdz/applyAudio',
    method: 'get',
    params
  })
}


// 倒闸操作票台账列表
export function getListForShenHe(data) {
  return request({
    url: '/bdzdz/getListForShenHe',
    method: 'post',
    data
  })
}

// /bdzdz/deleteshenhe 删除倒闸操作票台账
export function deleteByIDShenHe(data) {
  return request({
    url: '/bdzdz/deleteshenhe',
    method: 'delete',
    data
  })
}