import requirt from '@/utils/request'
// 获取列表
export function getList(data) {
  return requirt({
    url: '/equipmentDefect/getListForPage',
    method: 'post',
    data
  })
}
// 新增
export function saveData(data) {
  return requirt({
    url: '/equipmentDefect/addJsonWithAtt',
    method: 'post',
    data
  })
}
// 整改
export function addApplyWithAtt(data) {
    return requirt({
      url: '/equipmentDefect/addApplyForm',
      method: 'post',
      data
    })
}
// 详情
export function getDetailByInformId(params) {
  console.log("params",params)
  return requirt({
      url: '/equipmentDefect/getDetailByInformId',
      method: 'get',
      params
    })
}
// 删除
export function deleteData(data) {
  return requirt({
    url: '/equipmentDefect/deleteBatch',
    method: 'delete',
    data
  })
}