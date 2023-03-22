import requirt from '@/utils/request'

//获取班组字典表数据
export function getdict() {
    return requirt({
        url: '/dict/dictList/Team',
        method: 'get',
    })
}
//获取班组人员信息
export function getUsersDataByUnit(params) {
    return requirt({
        url: '/system/user/getUsersDataByUnit',
        method: 'get',
        params: params,
    })
}
//获取组织机构
export function getUnits() {
    return requirt({
        url: '/system/user/getUnits',
        method: 'get',
    })
}


/** 班组管理 */
// 查询
export function TeamGroupfindAllList(params) {
    return requirt({
        url: '/TeamGroupManagement/findAllList',
        method: 'get',
        params: params,
    })
}
// 新增
export function TeamGroupInsert(params) {
    return requirt({
        url: '/TeamGroupManagement/insert',
        method: 'post',
        data: params,
    })
}
// 编辑
export function TeamGroupUpdate(params) {
    return requirt({
        url: '/TeamGroupManagement/update',
        method: 'post',
        data: params,
    })
}
// 删除
export function TeamGroupDeleteBatch(params) {
    return requirt({
        url: '/TeamGroupManagement/deleteBatch',
        method: 'delete',
        data: params,
    })
}
// 导出
export function TeamGroupexportExcel() {
    return requirt({
        url: '/TeamGroupManagement/exportExcel',
        method: 'get'
    })
}
/** 班组量化考核规则管理 */
// 删除
export function QuaAssessDeleteBatch(params) {
    return requirt({
        url: '/TeamGroupQuaAssess/deleteBatch',
        method: 'delete',
        data: params,
    })
}
// 导出
export function QuaAssessexportExcel() {
    return requirt({
        url: '/TeamGroupQuaAssess/exportExcel',
        method: 'get'
    })
}
// 查询
export function QuaAssessfindAllList(params) {
    return requirt({
        url: '/TeamGroupQuaAssess/findAllList',
        method: 'get',
        params: params,
    })
}
// 查询单条
export function QuaAssessqueryByID(id) {
    return requirt({
        url: `/TeamGroupQuaAssess/queryByID?id=${id}`,
        method: 'get',
    })
}

// 新增
export function QuaAssessInsert(params) {
    return requirt({
        url: '/TeamGroupQuaAssess/insert',
        method: 'post',
        data: params,
    })
}
// 编辑
export function QuaAssessUpdate(params) {
    return requirt({
        url: '/TeamGroupQuaAssess/update',
        method: 'post',
        data: params,
    })
}

/** 班组量化考核 */

// 根据id查询单条信息
export function TeamGroupExamineQueryByID(id) {
    return requirt({
        url: `/TeamGroupExamine/queryByID?id=${id}`,
        method: 'GET',
    })
}

// 删除
export function TeamGroupExamineDeleteBatch(params) {
    return requirt({
        url: '/TeamGroupExamine/deleteBatch',
        method: 'delete',
        data: params,
    })
}

// 查询
export function TeamGroupExaminefindAllList(params) {
    return requirt({
        url: '/TeamGroupExamine/findAllList',
        method: 'get',
        params: params,
    })
}
// 新增
export function TeamGroupExamineInsert(params) {
    return requirt({
        url: '/TeamGroupExamine/insert',
        method: 'post',
        data: params,
    })
}
// 编辑
export function TeamGroupExamineUpdate(params) {
    return requirt({
        url: '/TeamGroupExamine/update',
        method: 'post',
        data: params,
    })
}
// 扣分考核类型
export function queryAssessType() {
    return requirt({
        url: '/TeamGroupExamine/queryAssessType',
        method: 'get',
    })
}
// 加分考核类型
export function queryAssessTypeAdd() {
    return requirt({
        url: '/TeamGroupExamine/queryAssessTypeAdd',
        method: 'get',
    })
}
// 根据考核类型查询扣分情况
export function queryDataByAssessType(assessType) {
    return requirt({
        url: `/TeamGroupExamine/queryDataByAssessType?assessType=${assessType}`,
        method: 'get',
    })
}
// 开启审批流程
export function TeamGroupExamineapplySubmit(params) {
    return requirt({
        url: "/TeamGroupExamine/applySubmit",
        method: 'post',
        data: params,
    })
}

// 审批
export function TeamGroupExamineapplyAudio(params) {
    return requirt({
        url: "/TeamGroupExamine/applyAudio",
        method: 'post',
        data: params,
    })
}


/** 月度量化考核成绩 */
// 查询
export function TeamGroupExaminequeryMonthAssessGrade(params) {
    return requirt({
        url: '/TeamGroupExamine/queryMonthAssessGrade',
        method: 'get',
        params: params,
    })
}
// 查询详情-月度量化考核成绩减分查询
export function TeamGroupExaminemonthAssessResult(date) {
    return requirt({
        url: `/TeamGroupExamine/monthAssessResult?date=${date}`,
        method: 'get',
    })
}
// 查询详情-月度量化考核成绩加分查询
export function TeamGroupExaminemonthAssessAdd(date) {
    return requirt({
        url: `/TeamGroupExamine/monthAssessAdd?date=${date}`,
        method: 'get',
    })
}
// 查询详情-月度量化考核成绩总分统计
export function TeamGroupExaminemonthAssessTotal(date) {
    return requirt({
        url: `/TeamGroupExamine/monthAssessTotal?date=${date}`,
        method: 'get',
    })
}
