import requirt from '@/utils/request'


// 数据身体
export function pageList(params) {
  return requirt({
    url: '/mdm/eqmMasterData/pageList',
    method: 'post',
    data: params,
  })
}

// 表头
export function queryListForClass(params) {
  return requirt({
    url: '/mdm/characterMaster/queryListForClass',
    method: 'get',
    params: params,
  })
}

// 表头
export function querySearchColumnForClass(params) {
  return requirt({
    url: '/mdm/characterMaster/querySearchColumnForClass',
    method: 'get',
    params: params,
  })
}

//新增接口
export function eqmMasterData(params) {
  return requirt({
    url: '/mdm/eqmMasterData',
    method: 'post',
    data: params,
  })
}

//删除接口
export function eqmMasterDataDelete(params) {
  return requirt({
    url: '/mdm/eqmMasterData',
    method: 'delete',
    data: params,
  })
}


//更新接口
export function characterMasterPut(params) {
  return requirt({
    url: '/mdm/eqmMasterData',
    method: 'put',
    data: params,
  })
}

//模板导出
export function exportXls(params) {
  return requirt({
    url: '/mdm/eqmMasterData/exportXls',
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}


