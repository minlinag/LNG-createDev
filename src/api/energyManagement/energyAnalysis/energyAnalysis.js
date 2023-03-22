import requirt from '@/utils/request'

//本月数据
export function queryCurrentMonth(params) {
  return requirt({
      url: '/nhfxZhnh/queryCurrentMonth',
      method: 'get',
      params,
  })
}

// 单耗/综合能耗
export function getFiveYearData(params) {
    return requirt({
        url: '/nhfxZhnh/getFiveYearData',
        method: 'get',
        params,
    })
}


//能耗分析
export function queryCompare(params) {
  return requirt({
      url: '/nhfxZhnh/queryCompare',
      method: 'get',
      params,
  })
}

//饼状图 年月
export function queryProportion(params) {
  return requirt({
      url: '/nhfxZhnh/queryProportion',
      method: 'get',
      params,
  })
}