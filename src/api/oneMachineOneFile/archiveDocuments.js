import requirt from '@/utils/request'
// 
export function getListForPage(params) {
  return requirt({
    url: '/archivesFile/getListForPage',
    method: 'post',
    data: params,
  })
}

export function addWihtAtt(params) {
  return requirt({
    url: '/archivesFile/addWihtAtt',
    method: 'post',
    data: params,
  })
}

export function archivesFileInsert(params) {
  return requirt({
    url: '/archivesFile/insert',
    method: 'post',
    data: params,
  })
}

export function archivesFileDelete(params) {
  return requirt({
    url: '/archivesFile/delete',
    method: 'DELETE',
    data: params,
  })
}