import requirt from '@/utils/request'
// 获取申请单列表
export function getList(params){
    return requirt({
        url:'/applicationForm/getListForPage',
        method:'post',
        data:params,
    })
}


// 获取外委工单列表
export function getOutsourcingUnit(params){
  return requirt({
      url:'/wwdwgl/getLisWithJob',
      method:'post',
      data:params,
  })
}

// 获取设备检修台账列表
export function findAllList(params){
  return requirt({
      url:'/checkLeder/findAllList',
      method:'post',
      data:params,
  })
}
//获取申请单新增form表单展示数据
export function getFormList(name){
    var  strJson = JSON.stringify(require('../../../static/data/applicationFrom.json'));
    var  constData = JSON.parse(strJson)
    return name?constData[name]:constData
}


//新增
export function addList(params){
    return requirt({
        url:'/applicationForm/addJsonWithAtt',
        method:'post',
        data:params,
    })
}

//新增直接提交
export function addSubmit(params){
  return requirt({
      url:'/applicationForm/addSubmit',
      method:'post',
      data:params,
  })
}

export function addDispatch(params){
  return requirt({
      url:'/notice/add',
      method:'post',
      data:params,
  })
}
//修改申请单
export function updataList(params){
    return requirt({
        url:'/applicationForm/updateJsonWithAtt',
        method:'post',
        data:params,
    })
}

//删除申请单
export function deleteList(params){
    return requirt({
        url:'/applicationForm/delete',
        method:'delete',
        data:params,
    })
}


export function applicationFormSubmit(params){
  return requirt({
      url:'/applicationForm/applicationFormSubmit',
      method:'get',
      params,
  })
}

// GET /applicationForm/applicatioinFormAudio
export function applicatioinFormAudio(params){
  return requirt({
      url:'/applicationForm/applicatioinFormAudio',
      method:'get',
      params,
  })
}

// 获取备品备件列表
export function getIdListForPage(params){
    return requirt({
        url:'/bpbjqd/getIdListForPage',
        method:'get',
        params,
    })
}
