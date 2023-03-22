import requirt from '@/utils/request'
// 
export function archivesClassificPageList(params) {
  return requirt({
    url: '/archivesClassific/pageList',
    method: 'get',
    params: params,
  })
}

export function archivesClassificQueryTree(params) {
  return requirt({
    url: '/archivesClassific/queryTree',
    method: 'get',
    params: params,
  })
}

export function archivesClassificDeleteBatch(params) {
  return requirt({
    url: '/archivesClassific/deleteBatch',
    method: 'DELETE',
    data: params,
  })
}

export function archivesClassificDeleteById(params) {
  return requirt({
    url: '/archivesClassific/deleteById',
    method: 'get',
    params: params,
  })
}

// 
export function findChildListFromtFeatureClassific(params) {
  return requirt({
    url: '/archivesClassific/findChildListFromtFeatureClassific',
    method: 'post',
    data: params,
  })
}

export function findChildList(params) {
  return requirt({
    url: '/archivesClassific/findChildList',
    method: 'post',
    data: params,
  })
}



export function archivesClassificAddList(params) {
  return requirt({
    url: '/archivesClassific/addList',
    method: 'post',
    data: params,
  })
}

export function archivesClassificFindOwnChildList(params) {
  return requirt({
    url: '/archivesClassific/findOwnChildList',
    method: 'get',
    params: params,
  })
}
export function archivesClassificConfigAddConfigList(params) {
  return requirt({
    url: '/archivesClassificConfig/addConfigList',
    method: 'post',
    data: params,
  })
}

export function archivesClassificConfigFindOwnConfigList(params) {
  return requirt({
    url: '/archivesClassificConfig/findOwnConfigList',
    method: 'get',
    params: params,
  })
}

export function queryEqmArchives(params) {
  return requirt({
    url: '/archivesClassificConfig/queryEqmArchives',
    method: 'get',
    params: params,
  })
}

export function archivesClassificConfigPageList(params) {
  return requirt({
    url: '/archivesClassificConfig/pageList',
    method: 'post',
    data: params,
  })
}
// 条件查询一机一档设备列表
export function findOneMachineOneFileList(params) {
  return requirt({
    url: '/archivesClassificConfig/findEquipmentList',
    method: 'post',
    data: params,
  })
}

//获取字典表数据
export function getSBGLDAWDdict(params) {
  return requirt({
    url: '/dict/getTreeDawd',
    methods: 'get',
    params: params,
  })
}




