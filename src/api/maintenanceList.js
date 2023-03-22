import requirt from '@/utils/request'
/*****.....设备润滑 2022.8.22 刘豪东
 *
 *
 * *****/
// 获取计划列表
export function getList(params){
    return requirt({
        url: '/eqmlubrication/pageList',
        method: 'get',
        params: params,
    })
}
//修改列表
export function upDateList(params){
    return requirt({
        url: '/eqmlubrication/update',
        method: 'post',
        data: params,
    })
}


