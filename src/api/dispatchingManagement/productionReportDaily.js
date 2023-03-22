/**
 * 气化外输调度令
 * zhangxiaoyang
 * 2022-10-13
 */
import requirt from '@/utils/request'

//分页查询
export function getList(params) {
    return requirt({
        url: '/scheduleScrb/selectList',
        method: 'get',
        params: params,
    })
}

//修改
export function update(params) {
    return requirt({
        url: '/scheduleScrb/update',
        method: 'post',
        data: params,
    })
}

//根据ID查询单条生产日报数据
export function getDataByID(params) {
    return requirt({
        url: '/scheduleScrb/selectByID',
        method: 'get',
        params: params,
    })
}

//开启流程
export function submit(id) {
    return requirt({
        url: '/scheduleScrb/scheduleScrbSubmit',
        method: 'get',
        params: {id:id},
    })
}

//审批
export function approval(params) {
    return requirt({
        url: '/scheduleScrb/scheduleScrbAudio',
        method: 'get',
        params: params,
    })
}