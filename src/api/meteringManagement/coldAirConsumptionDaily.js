import requirt from '@/utils/request'

//分页查询
export function getList(params) {
    return requirt({
        url: '/lnhqrb/findList',
        method: 'get',
        params: params,
    })
}

//修改
export function edit(params) {
    return requirt({
        url: '/lnhqrb/editByID',
        method: 'post',
        data: params,
    })
}

//查询月报报表数据
export function getListForMonthReport(params) {
    return requirt({
        url: '/lnhqrb/getListForMonthReport',
        method: 'post',
        params: params,
    })
}


