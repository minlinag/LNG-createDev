/**
 * 卸船计划
 * zhangxiaoyang
 * 2022-11-17
 */
import requirt from '@/utils/request'

//分页查询
export function getList(params) {
    return requirt({
        url: '/shipUnloadPlan/pageList',
        method: 'get',
        params: params,
    })
}

//获取当前日期之后的船期计划(包括当前日期)，含分页
export function getShipPlanList(params) {
    return requirt({
        url: '/shipUnloadPlan/queryPlanPageForAfterDay',
        method: 'get',
        params: params,
    })
}

//批量添加卸船储罐规划
export function addList(params) {
    return requirt({
        url: '/unloadingTankPlan/addList',
        method: 'post',
        data: params,
    })
}

//分页查询卸船储罐规划
export function getListByPlanNo(params) {
    return requirt({
        url: '/unloadingTankPlan/getListByPlanNo',
        method: 'post',
        data: params,
    })
}




//根据id查询详情
export function getDetailById(id) {
    return requirt({
        url: '/shipUnloadPlan/queryDetailById',
        method: 'get',
        params: {id:id},
    })
}