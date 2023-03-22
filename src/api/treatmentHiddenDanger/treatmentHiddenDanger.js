import requirt from '@/utils/request'

// 隐患列表
export function aqjcGetYhzgForPage(params) {
  return requirt({
    url: '/aqjc/getYhzgForPage',
    method: 'post',
    data: params,
  })
}
// 

export function getYhzgYSForPage(params) {
  return requirt({
    url: '/aqjc/getYhzgYSForPage',
    method: 'post',
    data: params,
  })
}
// 查询安全隐患列表
export function getList(params){
  return requirt({
      url: '/aqjc/getListForPage',
      method: 'post',
      data: params,
  })
}

// 删除隐患整改
export function deleteYHZGByIds(params){
  return requirt({
      url: '/aqjc/deleteYHZGByIds',
      method: 'post',
      data: params,
  })
}
// 添加
export function addPost(params){
  return requirt({
      url: '/aqjc/addYhzg',
      method: 'post',
      data: params,
  })
}

// 编辑
export function updatePost(params){
  return requirt({
      url: '/aqjc/updateYhzg',
      method: 'post',
      data: params,
  })
}
