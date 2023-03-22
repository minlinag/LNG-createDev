import requirt from '@/utils/request'
// 根据年度计划编号查询年度计划列表
export function annualPlan(params){
    return requirt({
        url: '/annualVerificationPlan/selectByAnnualPlanNo',
        method: 'get',
        params,
    })
}
// 新增年度设备检定计划
export function annualPlanPost(params){
    return requirt({
        url: '/annualVerificationPlan/insertNdjd',
        method: 'get',
        params,
    })
}

// 年度检定计划审批
export function yearApproval(params){
    return requirt({
        url: '/annualVerificationPlan/yearVerificationPlanAudio',
        method: 'get',
        params,
    })
}

// 年度检定计划开启流程
export function yearSubmit(params){
    return requirt({
        url: '/annualVerificationPlan/yearVerificationPlanSubmit',
        method: 'get',
        params,
    })
}

// 根据年度计划编号查询年度计划列表
export function findYear(params){
    return requirt({
        url: '/annualVerificationPlan/findYear',
        method: 'get',
        params,
    })
}
// 删除年度设备检定计划
export function deleteAnnualPlan(params){
    return requirt({
        url: '/annualVerificationPlan/deleteByIds',
        method: 'delete',
        data: params,
    })
}
// 根据id查询列表数据
export function getById(params){
    return requirt({
        url: '/annualVerificationPlan/selectById',
        method: 'get',
        params,
    })
}

