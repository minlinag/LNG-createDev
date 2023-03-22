import requirt from '@/utils/request'

//分页查询用户信息绑定记录
export function getUserBind(params) {
    return requirt({
        url: '/yhxxbd/getListForPage',
        method: 'post',
        data: params,
    })
}

//新增用户信息绑定
export function addUserBind(params) {
    return requirt({
        url: '/yhxxbd/add',
        method: 'post',
        data: params,
    })
}

//修改用户绑定信息
export function editUserBind(params) {
    return requirt({
        url: '/yhxxbd/update',
        method: 'post',
        data: params,
    })
}

//删除用户绑定信息
export function deleteUserBind(params) {
    return requirt({
        url: '/yhxxbd/delete',
        method: 'post',
        data: params,
    })
}

