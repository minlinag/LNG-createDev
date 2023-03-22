import requirt from '@/utils/request'

//查询当前登录用户信息
export function getUserInfo() {
    return requirt({
        url: '/system/user/getLoginUserInfo',
        method: 'post',
    })
}
