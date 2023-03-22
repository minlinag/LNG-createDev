import requirt from '@/utils/request'

/** 卸船记录 */
//卸船信息列表数据--分页
export function selectByCondition(params) {
    return requirt({
        url: '/unloadAShip/selectByCondition',
        method: 'get',
        params: params,
    })
}

//卸船信息详情
export function selectById(id) {
    return requirt({
        url: `/unloadAShip/selectById?id=${id}`,
        method: 'get',
    })
}
