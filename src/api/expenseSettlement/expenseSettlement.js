import requirt from '@/utils/request'
// 列表
export function getList(data) {
  return requirt({
    url: '/gasCostSettle/getListForPage',
    method: 'post',
    data
  })
}
// 新增
export function saveData(data) {
  return requirt({
    url: '/gasCostSettle/add',
    method: 'post',
    data
  })
}
// 查询详情
export function editData(data) {
    return requirt({
      url: '/gasCostSettle/update',
      method: 'post',
      data
    })
  }
// 查询详情
export function deleteData(data) {
  return requirt({
    url: '/gasCostSettle/delete',
    method: 'delete',
    data
  })
}
// 气化费结算申请开启流程
export function submit(params) {
  return requirt({
    url: '/gasCostSettle/submit',
    method: 'get',
    params
  })
}
// 气化费结算审批
export function audio(params) {
return requirt({
  url: '/gasCostSettle/audio',
  method: 'get',
  params
})
}