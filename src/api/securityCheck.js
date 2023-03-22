import requirt from '@/utils/request'
// 查询安全检查数据列表
export function getList(params){
    return requirt({
        url: '/aqjc/getListForPage',
        method: 'post',
        data: params,
    })
}

export function getAqjcForPage(params){
  return requirt({
      url: '/aqjc/getAqjcForPage',
      method: 'post',
      data: params,
  })
}

// 安全检查开启流程
export function aqjcSubmit(params) {
    return requirt({
        url: '/aqjc/aqjcSubmit',
        method: 'get',
        params,
    })
}

// 安环——安全检查审批
export function aqjcAudio(params) {
    return requirt({
        url: '/aqjc/aqjcAudio',
        method: 'get',
        params,
    })
}

//安全检查-json格式新增带附件
export function addPost(params){
    return requirt({
        url: '/aqjc/addJsonWithAtt',
        method: 'post',
        data: params,
    })
}

// 删除安全检查数据
export function deleteList(params){
    return requirt({
        url: '/aqjc/delete',
        method: 'delete',
        data: params,
    })
}

// 根据身份证号获取个人电子签章
export function signature(params) {
    return requirt({
        url: '/ca/queryImageByIdNumberForStr',
        method: 'get',
        params,
    })
}

export function saveSginPost(params){
    return requirt({
        url: '/aqjc/updateSignInfo',
        method: 'post',
        data: params,
    })
}
// // 根据ID查询单条JSA数据
// export function jsaIdSelected(params){
//     return requirt({
//         url: '/jsa/selectByID',
//         method: 'get',
//         params: params,
//     })
// }

// 修改安全检查数据
export function updatePost(params){
    return requirt({
        url: '/aqjc/update',
        method: 'post',
        data: params,
    })
}

// 安全检查统计检查主体列表数据
export function safetyStatistics(params){
  return requirt({
      url: '/SafetyCheckStatisticController/SafetyStatistic',
      method: 'post',
      data: params,
  })
}
// 安全检查统计检查人列表数据
export function safetyStatisticPerson(params){
 
  return requirt({
      url: '/SafetyCheckStatisticController/SafetyStatisticPerson',
      method: 'post',
      data: params,
  })
}

export function updateYhzgKL(params){
    return requirt({
        url: '/aqjc/updateYhzgKL',
        method: 'post',
        data: params,
    })
  }
// // 风险库开启流程
// export function jsaSubmit(params){
//     return requirt({
//         url: '/jsa/fxkSubmit',
//         method: 'get',
//         params: params,
//     })
// }
// // 安环——风险库审批
// export function jsaApproval(params){
//     return requirt({
//         url: '/jsa/fxkAudio',
//         method: 'get',
//         params: params,
//     })
// }
// // 删除JSA数据
// export function deleteJsa(params){
//     return requirt({
//         url: '/jsa/delete',
//         method: 'delete',
//         data: params,
//     })
// }
// //获取作业类型字典表数据
// export function getdict(params){
//     return requirt({
//         url: '/dict/dictList/ZYXKGL-ZYLX',
//         method: 'get',
//         params: params,
//     })
// }
// //获取措施
// export function getMeasures(type){
//     const testJson = require('../../static/data/measures.json')

//     return type?testJson[type]:testJson
// }
// // 获取外委单位下拉项信息
// export function companySelect(params){
//     return requirt({
//         url: '/wwdwgl/getCompanyInfo',
//         method: 'get',
//         params: params,
//     })
// }
// 查询风险库数据列表
export function findHeade(params){
    return requirt({
        url: '/SafetyCheckStatisticController/findHeader',
        method: 'post',
        data: params,
    })
}
