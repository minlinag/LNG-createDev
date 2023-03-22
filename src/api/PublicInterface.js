import requirt from '@/utils/request'
//获取页面
export function getContractListForPage(params){
    return requirt({
        url:'/wwdwhtgl/getListForPage',
        method:'post',
        data:params,
    })
}

export function findYearList(params){
    return requirt({
        url:'/Sbjwxtz/findYearList',
        method:'get',
        params:params,
    })
}
export function addAnnualInspectionPlan(params){
    return requirt({
        url:'/Sbjwxtz/addAnnualInspectionPlan',
        method:'post',
        data:params,
    })
}


// 月度计划审批
export function monthPlanAudio(params){
    return requirt({
        url:'/Sbjwxtz/monthPlanAudio',
        method:'get',
        params:params,
    })
}
// 月计划开启流程
export function monthPlanSubmit(params){
    return requirt({
        url:'/Sbjwxtz/monthPlanSubmit',
        method:'get',
        params:params,
    })
}

// 年计划开启流程
export function yearPlanSubmit(params){
    return requirt({
        url:'/Sbjwxtz/yearPlanSubmit',
        method:'get',
        params:params,
    })
}
// 年度计划审批
export function yearPlanAudio(params){
    return requirt({
        url:'/Sbjwxtz/yearPlanAudio',
        method:'get',
        params:params,
    })
}
//公共查询条件

export function queryPublicSearchColumn(params){
    return requirt({
        url:'/mdm/characterMaster/queryPublicSearchColumn',
        method:'get',
        params:params,
    })
}

// 条件查询列表信息（含分页）,初始化不以特征分类过滤

export function queryPageListForUnClass(params){
    return requirt({
        url:'/mdm/eqmMasterData/findEquipmentList',
        method:'post',
        data:params,
    })
}

// 条件查询 （表头）

export function queryCommonColumn(params){
    return requirt({
        url:'/mdm/characterMaster/queryCommonColumn',
        method:'get',
        params:params,
    })
}


