import requirt from '@/utils/request'

//分页查询冷能计量日报记录
export function getListForPage(params) {
    return requirt({
        url: '/lnjlrb/getListForPage',
        method: 'post',
        data: params,
    })
}

//查询月报报表数据
export function getListForMonthReport(params) {
    return requirt({
        url: '/lnjlrb/getListForMonthReport',
        method: 'post',
        params: params,
    })
}
