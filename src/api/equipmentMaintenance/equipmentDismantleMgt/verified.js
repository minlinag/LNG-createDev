import request from '@/utils/request'


// 列表
export function selectByMonthPlanNo(data) {
  return request({
    url: '/verificationPlanMinute/selectByMonthPlanNo',
    method: 'post',
    data
  })
}

// 审批 
export function selectByEgmCode(params) {
  return request({
    url: '/applicationForm/selectByEqmCode',
    method: 'get',
    params
  })
}

// 处理
export function addSubmit(data) {
  return request({
    url: '/applicationForm/addSubmit',
    method: 'post',
    data
  })
}

// 申请单
export function selectByCondition(data) {
  return request({
    url: '/applicationForm/selectByCondition',
    method: 'post',
    data
  })
}

// 通知单
export function selectOneByInformNo(params) {
  return request({
    url: '/notice/selectOneByInformNo',
    method: 'get',
    params
  })
}
