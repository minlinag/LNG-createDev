import requirt from '@/utils/request'
// 根据年度计划编号查询年度计划列表

// 根据年度计划编号查询月度列表
export function planMonth(params){
    return requirt({
        url: '/monthVerificationPlan/selectByAnnualPlanNo',
        method: 'get',
        params,
    })
}
// 根据月度计划编号查询设备检定计划详细列表
export function monthDetailsList(params){
    return requirt({
        url: '/verificationPlanMinute/selectByMonthPlanNo',
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
//新增年度设备检定计划
export function annualPlanPost(params){
    return requirt({
        url: '/annualVerificationPlan/insertNdjd',
        method: 'post',
        data: params,
    })
}
// 年度计划审批--（预览详细）查询
export function findAllByYear(params){
    return requirt({
        url: '/annualVerificationPlan/findAllByYear',
        method: 'get',
        params,
    })
}
// // 修改JSA数据
// export function jsaUpdate(params){
//     return requirt({
//         url: '/jsa/update',
//         method: 'post',
//         data: params,
//     })
// }
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

