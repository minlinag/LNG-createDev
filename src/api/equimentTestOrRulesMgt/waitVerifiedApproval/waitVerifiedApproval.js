import requirt from '@/utils/request'
// 获取待检定列表
export function getCondition(params) {
  return requirt({
    url: '/applicationForm/selectByCondition',
    method: 'post',
    data: params,
  })
}
// 新增年度设备检定计划
export function updataCondition(params) {
  return requirt({
    url: '/applicationForm/updateTodoInfo',
    method: 'post',
    data: params,
  })
}
// 派送新建申请单
export function addVerification(params) {
  return requirt({
    url: '/notice/addVerification',
    method: 'post',
    data: params,
  })
}


// 审批
export function eqmVerificationApplyFormAudio(params) {
  return requirt({
    url: '/applicationForm/eqmVerificationApplyFormAudio',
    method: 'get',
    params: params,
  })
}
// 根据id查询列表数据
export function getById(params) {
  return requirt({
    url: '/applicationForm/selectById',
    method: 'get',
    params,
  })
}