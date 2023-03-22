import requirt from '@/utils/request'
// 获取列表
export function getList(data) {
  return requirt({
    url: '/deviceRunInfo/getDeviceSynthBoardList',
    method: 'post',
    data
  })
}