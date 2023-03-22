import requirt from '@/utils/request'
// 查询JSA数据列表
export function jsaList(params) {
  return requirt({
    url: '/jsa/selectList',
    method: 'get',
    params: params,
  })
}
//初始化多选框数据
export function getCheckBox(type) {
  const qt = { label: "其他", value: "其他" }
  const checkBoxDate = require('../../static/data/jsaChackBoxList.json')
  return checkBoxDate
}
// 根据ID查询单条JSA数据
export function jsaIdSelected(params) {
  return requirt({
    url: '/jsa/selectByID',
    method: 'get',
    params: params,
  })
}
//新增JSA数据
export function jsaPost(params) {
  return requirt({
    url: '/jsa/insert',
    method: 'post',
    data: params,
  })
}
// 修改JSA数据
export function jsaUpdate(params) {
  return requirt({
    url: '/jsa/update',
    method: 'post',
    data: params,
  })
}
// 风险库开启流程
export function jsaSubmit(params) {
  return requirt({
    url: '/jsa/fxkSubmit',
    method: 'get',
    params: params,
  })
}
// 安环——风险库审批
export function jsaApproval(params) {
  return requirt({
    url: '/jsa/fxkAudio',
    method: 'get',
    params: params,
  })
}
// 删除JSA数据
export function deleteJsa(params) {
  return requirt({
    url: '/jsa/delete',
    method: 'delete',
    data: params,
  })
}
//获取作业类型字典表数据
export function getdict(params) {
  return requirt({
    url: '/dict/dictList/ZYXKGL-ZYLX',
    method: 'get',
    params: params,
  })
}
//获取措施
export function getMeasures(type) {
  const testJson = require('../../static/data/measures.json')

  return type ? testJson[type] : testJson
}
// 获取外委单位下拉项信息
export function companySelect(params) {
  return requirt({
    url: '/wwdwgl/getCompanyInfo',
    method: 'get',
    params: params,
  })
}
// 查询风险库数据列表
export function selectRick(params) {
  return requirt({
    url: '/fxk/selectList',
    method: 'get',
    params: params,
  })
}
