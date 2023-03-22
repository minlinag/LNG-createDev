import requirt from '@/utils/request'
/*****.....临时检修计划 2022.8.9 刘豪东
 *
 *
 * *****/
// 获取检测计划列表
export function getList(params){
    return requirt({
        url: '/TemMainPlan/findAllList',
        method: 'get',
        params: params,
    })
}
// 添加检测计划列表
export function addJsonWithAtt(params){
    return requirt({
        url: '/TemMainPlan/addJsonWithAtt',
        method: 'post',
        data: params,
    })
}

// 直接提交
export function overhauladdSubmit(params){
  return requirt({
      url: '/overhaulPlanController/addSubmit',
      method: 'post',
      data: params,
  })
}

//修改检测计划列表
export function upDateList(params){
    return requirt({
        url: '/TemMainPlan/updateJsonWithAtt',
        method: 'post',
        data: params,
    })
}
//获取字典表数据
export function getdict(params){
    return requirt({
        url: '/dict/dictList/AQYH-QYMC',
        // url: '/dict/dictList/SBGL-JH-ZYSSQY',
        method: 'get',
        params: params,
    })
}

// 提交审批开启流程
export function temSubmit(params){
  return requirt({
      url: '/TemMainPlan/submit',
      method: 'get',
      params: params,
  })
}


// 审批确定
export function audio(params){
  return requirt({
      url: '/TemMainPlan/audio',
      method: 'get',
      params: params,
  })
}

// 删除列表
export function deleteBatch(params){
  return requirt({
      url:'/TemMainPlan/deleteBatch',
      method:'delete',
      data:params,
  })
}
