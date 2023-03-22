import request from '@/utils/request'

// 获取工作票列表
export function getListForPage(data) {
  return request({
    url: '/lzzyp/getListForPage',
    method: 'post',
    data
  })
}

// 生成工作票编号
export function createNewId(params) {
  return request({
    url: '/lzzyp/createNewId',
    method: 'post',
    params
  })
}

// 新增工作票
export function insert(data) {
  return request({
    url: '/lzzyp/insert',
    method: 'post',
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


// 获取工作票详情
export function selectByID(data) {
  return request({
    url: '/lzzyp/selectByID',
    method: 'post',
    data
  })
}

// /lzzyp/delete 删除工作票
export function deleteByID(data) {
  return request({
    url: '/lzzyp/delete',
    method: 'delete',
    data
  })
}

// /lzzyp/update 修改工作票
export function update(data) {
  return request({
    url: '/lzzyp/update',
    method: 'post',
    data
  })
}

//  审核工作票列表
export function getListForShenHe(data) {
  return request({
    url: '/lzzyp/getListForShenHe',
    method: 'post',
    data
  })
}

// 申请开启审批流程
export function applySubmit(params) {
  return request({
    url: '/lzzyp/ApplySubmit',
    method: 'get',
    params
  })
}

// 申请开启审批
export function applyAudio(params) {
  return request({
    url: '/lzzyp/applyAudio',
    method: 'get',
    params
  })
}

// /lzzyp/deleteshenhe 删除审核工作票
export function deleteshenhe(data) {
  return request({
    url: '/lzzyp/deleteshenhe',
    method: 'delete',
    data
  })
}