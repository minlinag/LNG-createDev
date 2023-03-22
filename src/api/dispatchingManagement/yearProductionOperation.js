import requirt from '@/utils/request'

//分页查询用户信息绑定记录
export function pageList(params) {
    return requirt({
        url: '/po/pm/planManage/pageList',
        method: 'get',
        params: params,
    })
}
//查询详情
export function queryDetailById(params) {
    return requirt({
        url: '/po/pm/planManage/queryDetailById',
        method: 'get',
        params: params,
    })
}
// 查询附件
export function queryFileByRelatedId(id) {
    return requirt({
        url: `/fileinfo/getFileNameByRelatedId?relatedId=${id}`,
        method: 'get',
    })
}

//新增或者修改数据-保存
export function saveForAddOrUpdate(params) {
    return requirt({
        url: '/po/pm/planManage/saveForAddOrUpdate',
        method: 'post',
        data: params,
    })
}
//删除年度的数据
export function deleteBatchForYear(params) {
    return requirt({
        url: '/po/pm/planManage/deleteBatchForYear',
        method: 'DELETE',
        data: params,
    })
}
//删除月度的数据
export function deleteBatchForMonth(params) {
    return requirt({
        url: '/po/pm/planManage/deleteBatchForMonth',
        method: 'DELETE',
        data: params,
    })
}
// 月报通过日期查询数据
export function queryYearDataByTime(params) {
    return requirt({
        url: '/po/pm/planManage/queryYearDataByTime',
        method: 'get',
        params: params,
    })
}
// 查询年度生产运行计划接船计划
export function queryCqjhByYear(params) {
    return requirt({
        url: '/po/pm/planManage/queryCqjhByYear',
        method: 'get',
        params: params,
    })
}
//用户信息
export function getLoginUserInfo(params) {
    return requirt({
        url: '/system/user/getLoginUserInfo',
        method: 'post',
        data: params,
    })
}
// 查询月度生产运行计划的卸货量
export function queryCqjhByYearMon(params) {
    return requirt({
        url: '/po/pm/planManage/queryCqjhByYearMon',
        method: 'get',
        params: params,
    })
}
 
// 提交
export function submitForAddOrUpdate(params) {
    return requirt({
        url: '/po/pm/planManage/submitForAddOrUpdate',
        method: 'post',
        data: params,
    })
}

// 审批
export function monthPlanAudio(params) {
    return requirt({
        url: '/po/pm/planManage/monthPlanAudio',
        method: 'get',
        params: params,
    })
}