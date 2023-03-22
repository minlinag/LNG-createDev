// 安全风险管控
import requirt from '@/utils/request'

// 风险清单列表
export function getListForPage(params){
    return requirt({
        url: '/aqfxgk/getListForPage',
        method: 'post',
        data: params,
    })
}

// 风险清单新增
export function addRisk(params){
  return requirt({
      url: '/aqfxgk/add',
      method: 'post',
      data: params,
  })
}

// 风险清单新增
export function updateRisk(params){
  return requirt({
      url: '/aqfxgk/update',
      method: 'post',
      data: params,
  })
}

// 风险清单删除
export function deleteRisk(params){
  return requirt({
      url: '/aqfxgk/delete',
      method: 'post',
      data: params,
  })
}

// 安全风险分布图
export function selectMaxVal(params){
  return requirt({
      url: '/aqfxgk/selectMaxVal',
      method: 'post',
      data: params,
  })
}

//获取字典表数据
export function getdict(params){
  return requirt({
      url: '/dict/dictList/AQYH-QYMC',
      method: 'get',
      params: params,
  })
}

// 安全风险培训列表
export function getRiskTrain(params){
  return requirt({
      url: '/riskTrain/getListForPage',
      method: 'post',
      data: params,
  })
}

// 安全风险培训新增
export function addRiskTrain(params){
  return requirt({
      url: '/riskTrain/addJsonWithAtt',
      method: 'post',
      data: params,
  })
}

// 安全风险培训编辑
export function updateRiskTrain(params){
  return requirt({
      url: '/riskTrain/updateJsonWithAtt',
      method: 'post',
      data: params,
  })
}




