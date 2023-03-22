import requirt from '@/utils/request'
//获取页面
export function getListForPage(params) {
  return requirt({
    url: '/wwdwgl/getListForPage2',
    method: 'post',
    data: params,
  })
}

// 获取外委单位下拉项信息
export function companySelect(params) {
  return requirt({
    url: '/wwdwgl/getCompanyInfo',
    method: 'get',
  })
}

export function getOneById(params) {
  return requirt({
    url: '/wwdwgl/getOneById/${params}',
    method: 'get',
  })
}
//添加外委单位
export function add(params) {
  return requirt({
    url: '/wwdwgl/addWihtAtt',
    method: 'post',
    data: params,
  })
}
//修改更新外委单位
export function update(params) {
  return requirt({
    url: '/wwdwgl/update',
    method: 'post',
    data: params,
  })
}
//删除外委单位
export function mydelete(params) {
  return requirt({
    url: '/wwdwgl/delete',
    method: 'delete',
    data: params,
  })
}
//获取字典表数据
export function getdict(params) {
  return requirt({
    url: '/dict/dictList/SBGL-WWDW-ZT',
    method: 'get',
    params: params,
  })
}
