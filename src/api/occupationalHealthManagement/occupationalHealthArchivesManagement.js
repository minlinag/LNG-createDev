import request from '@/utils/request'

// 职业健康危害因素分析-列表
export function harmFactorsAnalysisFindAllList(params) {
  return request({
    url: '/HarmFactorsAnalysis/findAllList',
    method: 'get',
    params
  })
}

// 职业健康危害因素分析-新增
export function harmFactorsAnalysisInsert(data) {
  return request({
    url: '/HarmFactorsAnalysis/insert',
    method: 'post',
    data
  })
}

// 职业健康危害因素分析-详情
export function harmFactorsAnalysisQueryByID(params) {
  return request({
    url: '/HarmFactorsAnalysis/queryByID',
    method: 'get',
    params
  })
}

// 职业健康危害因素分析-编辑
export function harmFactorsAnalysisUpdateMain(data) {
  return request({
    url: '/HarmFactorsAnalysis/updateMain',
    method: 'post',
    data
  })
}

// 职业健康危害因素分析-删除
export function harmFactorsAnalysisDeleteBatch(data) {
  return request({
    url: '/HarmFactorsAnalysis/deleteBatch',
    method: 'delete',
    data
  })
}

// 职业健康档案-列表
export function professionHealthArchivesFindAllList(params) {
  return request({
    url: '/ProfessionHealthArchives/findAllList',
    method: 'get',
    params
  })
}

// 职业健康档案-生成编号最后三位
export function professionHealthArchivesSelectCount(data) {
  return request({
    url: '/ProfessionHealthArchives/selectCount',
    method: 'post',
    data
  })
}

// 职业健康档案-查询岗位名称列表
export function professionHealthArchivesQueryPostName(data) {
  return request({
    url: '/ProfessionHealthArchives/queryPostName',
    method: 'post',
    data
  })
}

// 职业健康档案-获取岗位责任
export function personnelExamineSelectPostDutyData(params) {
  return request({
    url: '/PersonnelExamine/selectPostDutyData',
    method: 'get',
    params
  })
}

// 职业健康档案-新增人员体检信息
export function professionHealthArchivesInsert(data) {
  return request({
    url: '/ProfessionHealthArchives/insert',
    method: 'post',
    data
  })
}

// 职业健康档案-编辑职业健康档案信息
export function professionHealthArchivesUpdate(data) {
  return request({
    url: '/ProfessionHealthArchives/update',
    method: 'post',
    data
  })
}

// 职业健康档案-单条信息
export function professionHealthArchivesQueryByID(params) {
  return request({
    url: '/ProfessionHealthArchives/queryByID',
    method: 'get',
    params
  })
}

// 职业健康档案-新增考核记录信息
export function professionHealthArchivesInsertRecord(data) {
  return request({
    url: '/ProfessionHealthArchives/insertRecord',
    method: 'post',
    data
  })
}


// 职业健康档案-删除考核记录信息
export function professionHealthArchivesDeleteBatch(data) {
  return request({
    url: '/ProfessionHealthArchives/deleteBatch',
    method: 'delete',
    data
  })
}
