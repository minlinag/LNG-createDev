import requirt from '@/utils/request'
//查询
export function getListForPage(params) {
    return requirt({
        url: '/cczcjl/getListForPage',
        method: 'post',
        data: params,
    })
}