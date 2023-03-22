import requirt from '@/utils/request'
export function queryLubricationArchives(params) {
  return requirt({
    url: '/archivesClassific/findValue',
    method: 'get',
    params: params,
  })
}

export function queryLubricationArchivesHeader(params) {
  return requirt({
    url: '/archivesClassific/findHeader',
    method: 'get',
    params: params,
  })
}