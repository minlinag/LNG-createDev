import requirt from '@/utils/request'
//新增设备检定计划详细
export function verificationPlanPost(params){
    return requirt({
        url: '/verificationPlanMinute/insert',
        method: 'post',
        data: params,
    })
}

// 待检定-上传证书
export function insertCertificate(params){
    return requirt({
        url: '/verificationPlanMinute/insertCertificate',
        method: 'post',
        data: params,
    })
}
// 编辑检定计划--根据单条查找到当前详细数据
export function selectByID(params){
    return requirt({
        url: '/verificationPlanMinute/selectByID',
        method: 'get',
        params,
    })
}

// 根据月度计划对应“yyyy-MM”查询设备检定计划详细列表
export function selectByMonthPlanNo(params){
    return requirt({
        url: '/verificationPlanMinute/selectByMonthPlanNo',
        method: 'post',
        data: params,
    })
}
// 编辑设备检定计划
export function verificationPlanEdit(params){
    return requirt({
        url: '/verificationPlanMinute/edit',
        method: 'post',
        data: params,
    })
}
// 编辑月度设备检定计划
export function monthPlanEdit(params){
    return requirt({
        url: '/verificationPlanMinute/editMonth',
        method: 'post',
        data: params,
    })
}

// 删除设备检定计划详细
export function deleteVerificationPlan(params){
    return requirt({
        url: '/verificationPlanMinute/deleteByIds',
        method: 'delete',
        data: params,
    })
}


// 查询所属设备下拉框
export function queryEquipmentList(params){
    return requirt({
        url: '/checkLeder/queryEquipmentList',
        method: 'post',
        data: params,
    })
}