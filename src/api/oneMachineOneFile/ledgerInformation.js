import requirt from '@/utils/request'
// 
export function queryCatalogue(params) {
  return requirt({
    url: '/archivesFile/queryCatalogue',
    method: 'post',
    data: params,
  })
}
//获取字典表数据
export function getSBGLDAWDdict(params) {
  return requirt({
    url: '/dict/getTreeDawd',
    methods: 'get',
    params: params,
  })
}

export function getTree(params) {
  return requirt({
    url: '/dict/getTree',
    methods: 'get',
    params: params,
  })
}
