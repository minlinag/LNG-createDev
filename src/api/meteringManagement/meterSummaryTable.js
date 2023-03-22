import requirt from '@/utils/request'

//分页查询
export function getList(params) {
    return requirt({
        url: '/ExportMeasureTotalTableController/findAllList',
        method: 'get',
        params: params,
    })
}


