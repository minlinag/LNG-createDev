import requirt from '@/utils/request'

//分页查询耗电记录
export function getListForPage(params) {
    return requirt({
        url: '/electricDailyReport/getListForPage',
        method: 'post',
        data: params,
    })
}

