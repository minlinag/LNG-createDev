import requirt from '@/utils/request'
// 获取列表
export function getList(data) {
  return requirt({
    url: '/notice/querySparePart',
    method: 'post',
    data
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