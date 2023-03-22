
import request from '@/utils/request'

// /AppraiseTemplate/query 查询
export function query(data) {
  return request({
    url: '/AppraiseTemplate/query',
    method: 'post',
    data
  })
}
// /AppraiseTemplate/insert 新增
export function insert(data) {
  return request({
    url: '/AppraiseTemplate/insert',
    method: 'post',
    data
  })
}

// /AppraiseTemplate/detail 查询详情
export function detail(data) {
  return request({
    url: '/AppraiseTemplate/detail',
    method: 'post',
    data
  })
}

// /AppraiseTemplate/delete 删除
export function deleteTemplate(data) {
  return request({
    url: '/AppraiseTemplate/delete',
    method: 'delete',
    data
  })
}
