import requirt from '@/utils/request'

/** 违规级别配置 */
//新增 
export function insertSelectiveJ(params) {
    return requirt({
        url: '/violationManagement/insertSelectiveJ',
        method: 'post',
        data: params,
    })
}
//删除
export function deleteByIdJ(params) {
    return requirt({
        url: '/violationManagement/deleteByIdJ',
        method: 'delete',
        params: params,
    })
}
//查询
export function selectByConditionJ(params) {
    return requirt({
        url: '/violationManagement/selectByConditionJ',
        method: 'post',
        data: params,
    })
}
//编辑
export function updateSelectiveJ(params) {
    return requirt({
        url: '/violationManagement/updateSelectiveJ',
        method: 'post',
        data: params,
    })
}
/** 违规项配置 */
//删除
export function deleteByIdG(params) {
    return requirt({
        url: '/violationManagement/deleteByIdG',
        method: 'delete',
        params: params,
    })
}
//新增 
export function insertSelectiveG(params) {
    return requirt({
        url: '/violationManagement/insertSelectiveG',
        method: 'post',
        data: params,
    })
}
//查询
export function selectByConditionG(params) {
    return requirt({
        url: '/violationManagement/selectByConditionG',
        method: 'post',
        data: params,
    })
}
//编辑
export function updateSelectiveG(params) {
    return requirt({
        url: '/violationManagement/updateSelectiveG',
        method: 'post',
        data: params,
    })
}
//级别下拉
export function selectRank() {
    return requirt({
        url: '/violationManagement/selectRank',
        method: 'post',
    })
}
//获取字典表数据
export function getdict(id) {
    return requirt({
        url: `/dict/dictList/${id}`,
        method: 'get',
    })
}

/** 违规管理 */
//删除
export function deleteByIdGl(params) {
    return requirt({
        url: '/violationManagement/deleteByIdGl',
        method: 'delete',
        params: params,
    })
}
//新增 
export function insertSelectiveGl(params) {
    return requirt({
        url: '/violationManagement/insertSelectiveGl',
        method: 'post',
        data: params,
    })
}
//查询
export function selectByConditionGl(params) {
    return requirt({
        url: '/violationManagement/selectByConditionGl',
        method: 'post',
        data: params,
    })
}
//编辑
export function updateSelectiveGl(params) {
    return requirt({
        url: '/violationManagement/updateSelectiveGl',
        method: 'post',
        data: params,
    })
}
// 根据时间查承运商
export function selelctCommonCarrier(violationsDate) {
    return requirt({
        url: `/lngSales/selelctCommonCarrier?violationsDate=${violationsDate}`,
        method: 'get',
    })
}
// 承运商下拉
export function selelctCommonCarrierList() {
    return requirt({
        url: "/lngSales/selelctCommonCarrierList",
        method: 'get',
    })
}
// 根据承运商查牵引车号
export function selelctTractionVehicleNumber(commonCarrier) {
    return requirt({
        url: `/lngSales/selelctTractionVehicleNumber?commonCarrier=${commonCarrier}`,
        method: 'get',
    })
}
// 根据牵引车号查车辆信息
export function selelctVehicleInformation(vehicleInformation) {
    return requirt({
        url: `/lngSales/selelctVehicleInformation?vehicleInformation=${vehicleInformation}`,
        method: 'get',
    })
}
// 违规管理详情 级别、描述
export function selectInsertJ() {
    return requirt({
        url: "/violationManagement/selectInsertJ",
        method: 'get',
    })
}
/** 承运单位考核统计详情*/
// 查询
export function selectCarrierUnit(params) {
    return requirt({
        url: '/violationManagement/selectCarrierUnit',
        method: 'post',
        data: params,
    })
}
// 详情
export function selectByMonthCarrierUnit(params) {
    return requirt({
        url: '/violationManagement/selectByMonth',
        method: 'post',
        data: params,
    })
}
