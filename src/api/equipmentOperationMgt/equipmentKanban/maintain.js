import requirt from '@/utils/request'
// 获取列表
export function getList(data) {
  return requirt({
    url: '/equipmentBoard/getListForPage',
    method: 'post',
    data
  })
}
// 获取所有已经添加的为好
export function getBitNoList(params) {
  return requirt({
    url: '/equipmentBoard/getBitNoList',
    method: 'get',
    params
  })
}
// 新增
export function saveData(data) {
  return requirt({
    url: '/equipmentBoard/add',
    method: 'post',
    data
  })
}
// 删除
export function deleteData(data) {
  return requirt({
    url: '/equipmentBoard/deleteBatch',
    method: 'delete',
    data
  })
}