import requirt from '@/utils/request'
// 获取列表
export function getList(data) {
  return requirt({
    url: '/equipmentStartStopPlan/getListForPage',
    method: 'post',
    data
  })
}
// 新增
export function saveData(data) {
  return requirt({
    url: '/equipmentStartStopPlan/add',
    method: 'post',
    data
  })
}
// 获取列表-编辑
export function getEditList(data) {
    return requirt({
      url: '/equipmentStartStopPlanSub/getListForPage',
      method: 'post',
      data
    })
  }
// 修改
export function update(data) {
  return requirt({
    url: '/equipmentStartStopPlanSub/update',
    method: 'post',
    data
  })
}
// 删除
export function deleteData(data) {
  return requirt({
    url: '/equipmentStartStopPlan/deleteBatch',
    method: 'delete',
    data
  })
}