import requirt from '@/utils/request'

//分页查询
export function getListForPage(params) {
    return requirt({
        url: '/dieselOilMonthlyReport/getListForPage',
        method: 'post',
        data: params,
    })
}


//查询日报数据
export function queryDailyData(params) {
    return requirt({
        url: '/dieselOilMonthlyReport/queryDailyData',
        method: 'get',
        params: params,
    })
}

//添加
export function add(params) {
    return requirt({
        url: '/dieselOilMonthlyReport/add',
        method: 'post',
        data: params,
    })
}

//添加
export function deletes(params) {
    return requirt({
        url: '/dieselOilMonthlyReport/deleteBatch',
        method: 'delete',
        data: params,
    })
}

//修改
export function update(params) {
    return requirt({
        url: '/dieselOilMonthlyReport/update',
        method: 'post',
        data: params,
    })
}

//根据编号查询详情
export function getDetailById(id) {
    return requirt({
        url: '/dieselOilMonthlyReport/getDetailById',
        method: 'get',
        params: { id: id },
    })
}



//提交  开启流程
export function submit(id) {
    return requirt({
        url: '/dieselOilMonthlyReport/submit',
        method: 'get',
        params: { id: id },
    })
}

//审批
export function approval(params) {
    return requirt({
        url: '/dieselOilMonthlyReport/audio',
        method: 'get',
        params: params,

    })
}