//风险清单申报
// 风险库
import requirt from '@/utils/request'
//获取页面列表
export function getRiskDeclaraList(params) {
    return requirt({
        url: '/riskListDeclaration/getListForPage',
        method: 'post',
        data: params,
    })
}
// riskListDeclaration/getRiskInfoListForPageByRiskIds
// etRiskInfoList
//获取页面列表
export function getRiskInfoList(params) {
    return requirt({
        url: '/riskListDeclaration/getRiskInfoListForPageByRiskIds',
        method: 'post',
        data: params,
    })
}
//获取页面列表
export function addList(params) {
    return requirt({
        url: '/riskListDeclaration/add',
        method: 'post',
        data: params,
    })
}
//删除风险清单
export function delectList(params) {
    return requirt({
        url: '/riskListDeclaration/deleteBatch',
        method: 'delete',
        data: params,
    })
}

// 风险清单申报提交
export function saveSubmit(params) {
  return requirt({
      url: '/riskListDeclaration/saveSubmit',
      method: 'post',
      data: params,
  })
}

// 风险清单申报审批确定
export function approval(params) {
  return requirt({
      url: '/riskListDeclaration/riskListDeclarationAudio',
      method: 'get',
      params
    })
}