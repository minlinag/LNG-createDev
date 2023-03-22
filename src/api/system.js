import requirt from '@/utils/request'

// 查询接口
export function getAuthButtonByPageCode(params){
    return requirt({
        url: '/system/auth/getAuthButtonByPageCode',
        method: 'get',
        params: params,
    })
}
