// 风险库
import requirt from '@/utils/request'
//获取页面
export function getRiskList(params) {
  return requirt({
    url: '/fxk/selectList',
    method: 'get',
    params: params,
  })
}
export function getTree(params) {
  return requirt({
    url: '/fxfjjg/getTree',
    method: 'get',
    params: params,
  })
}
export function getDictTree(params) {
  return requirt({
    url: '/dict/getTreeFX',
    method: 'get',
    params: params,
  })
}
export function dictAddDict(params) {
  return requirt({
    url: '/dict/addDictFX',
    method: 'post',
    data: params,
  })
}

export function dictUpdateDict(params) {
  return requirt({
    url: '/dict/updateDict',
    method: 'PUT',
    data: params
  })
}


export function dictDeleteDict(params) {
  return requirt({
    url: '/dict/deleteDict',
    method: 'delete',
    data: params,
  })
}

export function dictDeleteDictFX(params) {
  return requirt({
    url: '/dict/deleteDictFX',
    method: 'get',
    params: params,
  })
}



export function fxkInsert(params) {
  return requirt({
    url: '/fxk/insert',
    method: 'post',
    data: params,
  })
}

export function fxkSelectByID(params) {
  return requirt({
    url: '/fxk/selectByID',
    method: 'get',
    params: params,
  })
}
export function fxkUpdate(params) {
  return requirt({
    url: '/fxk/update',
    method: 'post',
    data: params,
  })
}

export function fxkDelete(params) {
  return requirt({
    url: '/fxk/delete',
    method: 'delete',
    data: params,
  })
}


// export function getContractListForPage(params){
//     return requirt({
//         url:'/wwdwhtgl/getListForPage',
//         method:'post',
//         data:params,
//     })
// }

