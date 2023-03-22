// 交接班管理
import requirt from '@/utils/request'

/** 运行班组交接班 */
// 查询
export function operatingTeamselect(params) {
    return requirt({
        url: '/operatingTeam/selectByCondition',
        method: 'post',
        data: params,
    })
} 
// 删除
export function operatingTeamdelete(params) {
    return requirt({
        url: '/operatingTeam/deleteByIds',
        method: 'post',
        data: params,
    })
}
// 编辑
export function operatingTeamedit(params) {
    return requirt({
        url: '/operatingTeam/editById',
        method: 'post',
        data: params,
    })
}
// 新增、提交
export function operatingTeaminsert(params) {
    return requirt({
        url: '/operatingTeam/insertSelective',
        method: 'post',
        data: params,
    })
}
// 接班、退回
export function operatingTeamsendBack(params) {
    return requirt({
        url: '/operatingTeam/sendBackTwo',
        method: 'post',
        data: params,
    })
}
// 查询单条详情数据
export function operatingTeamselectById(id) {
    return requirt({
        url: `/operatingTeam/selectById?id=${id}`,
        method: 'get',
    })
}


/** 槽车区交接班 */

// 查询
export function tankerAreaselect(params) {
    return requirt({
        url: '/tankerArea/selectByCondition',
        method: 'post',
        data: params,
    })
} 
// 删除
export function tankerAreadelete(params) {
    return requirt({
        url: '/tankerArea/deleteByIds',
        method: 'post',
        data: params,
    })
}

// 新增、提交
export function tankerAreainsert(params) {
    return requirt({
        url: '/tankerArea/insertSelective',
        method: 'post',
        data: params,
    })
}
// 编辑
export function tankerAreaedit(params) {
    return requirt({
        url: '/tankerArea/editById',
        method: 'post',
        data: params,
    })
}
// 接班、退回
export function tankerAreasendBack(params) {
    return requirt({
        url: '/tankerArea/sendBack',
        method: 'post',
        data: params,
    })
}
// 查询单条详情数据
export function tankerAreaselectById(id) {
    return requirt({
        url: `/tankerArea/selectById?id=${id}`,
        method: 'get',
    })
}