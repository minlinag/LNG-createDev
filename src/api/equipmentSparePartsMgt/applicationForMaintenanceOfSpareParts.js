import requirt from '@/utils/request'
// 备品备件获取列表
export function getList(data) {
  return requirt({
    url: '/bpbjeqmgx/getListForPage',
    method: 'post',
    data
  })
}
// 新增
export function saveData(data) {
  return requirt({
    url: '/bpbjeqmgx/saveBpbj',
    method: 'post',
    data
  })
}
// 查询详情
export function detail(data) {
    return requirt({
      url: '/bpbjeqmgx/selectByDeviceCodes',
      method: 'post',
      data
    })
  }