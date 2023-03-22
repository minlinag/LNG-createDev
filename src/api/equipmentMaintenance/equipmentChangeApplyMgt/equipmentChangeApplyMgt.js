import requirt from '@/utils/request'
// 获取列表
export function getList(data) {
  return requirt({
    url: '/equipmentAlteration/getListForPage',
    method: 'post',
    data
  })
}
// 新增
export function saveData(data) {
  return requirt({
    url: '/equipmentAlteration/addJsonWithAtt',
    method: 'post',
    data
  })
}
// 修改
export function editData(data) {
  return requirt({
    url: '/equipmentAlteration/updateJsonWithAtt',
    method: 'post',
    data
  })
}
// 修改派工状态
export function editDispatData(data) {
  return requirt({
    url: '/equipmentAlteration/update',
    method: 'post',
    data
  })
}
// 删除
export function deleteData(data) {
  return requirt({
    url: '/equipmentAlteration/deleteBatch',
    method: 'delete',
    data
  })
}
// 审批 
export function approval(params) {
  return requirt({
    url: '/equipmentAlteration/equipmentAlterationAudio',
    method: 'get',
    params
  })
}
// 审批流程开始--提交
export function submit(params) {
  return requirt({
    url: '/equipmentAlteration/equipmentAlterationSubmit',
    method: 'get',
    params
  })
}
// 审批历史列表
export function historyList(params) {
  return requirt({
    url: '/workflow/historyList',
    method: 'get',
    params
  })
}
// 审批流程图
export function stepData(params) {
  return requirt({
    url: '/workflow/businessActivity',
    method: 'get',
    params
  })
}
// 设备查询弹窗接口
export function findEquipmentList(data) {
  return requirt({
    url: '/mdm/eqmMasterData/findEquipmentList',
    method: 'post',
    data
  })
}
// 根据ID获取详情
export function selectByID(params) {
  return requirt({
    url: '/equipmentAlteration/selectByID',
    method: 'get',
    params
  })
}