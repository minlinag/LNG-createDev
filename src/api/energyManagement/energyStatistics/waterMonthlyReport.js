import requirt from '@/utils/request'

//分页查询
export function getListForPage(params) {
    return requirt({
        url: '/waterMonthlyReport/getListForPage',
        method: 'post',
        data: params,
    })
}

//查询日报数据
export function queryDailyData(params) {
    return requirt({
        url: '/waterMonthlyReport/queryDailyData',
        method: 'get',
        params: params,
    })
}

//添加
export function add(params) {
    return requirt({
        url: '/waterMonthlyReport/add',
        method: 'post',
        params: params,
    })
}

//添加
export function deletes(params) {
    return requirt({
        url: '/waterMonthlyReport/deleteBatch',
        method: 'delete',
        data: params,
    })
}

//修改
export function update(params) {
    return requirt({
        url: '/waterMonthlyReport/update',
        method: 'post',
        params: params,
    })
}



//提交  开启流程
export function submit(id) {
    return requirt({
        url: '/waterMonthlyReport/submit',
        method: 'get',
        params: { id: id },
    })
}

//审批
export function approval(params) {
    return requirt({
        url: '/waterMonthlyReport/audio',
        method: 'get',
        params: params,

    })
}