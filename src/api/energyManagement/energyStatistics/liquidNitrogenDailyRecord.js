import requirt from '@/utils/request'

//分页查询
export function getListForPage(params) {
    return requirt({
        url: '/n2DailyReport/getListForPage',
        method: 'post',
        data: params,
    })
}

