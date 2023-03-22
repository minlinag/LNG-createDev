import requirt from '@/utils/request'

//分页查询
export function getListForPage(params) {
    return requirt({
        url: '/tScyxJlglFxjygl/getListForPage',
        method: 'post',
        data: params,
    })
}

//根据id查询
export function getById(id) {
    return requirt({
        url: `/tScyxJlglFxjygl/getById?id=${id}`,
        method: 'get',
    })
}

// 删除
export function deleteByIds(params) {
    return requirt({
        url: '/tScyxJlglFxjygl/delete',
        method: 'delete',
        data: params,
    })
}
// 新增
export function add(params) {
    return requirt({
        url: '/tScyxJlglFxjygl/add',
        method: 'post',
        data: params,
    })
}
// 修改
export function update(params) {
    return requirt({
        url: '/tScyxJlglFxjygl/update',
        method: 'post',
        data: params,
    })
}
//用户信息
export function getLoginUserInfo(params) {
    return requirt({
        url: '/system/user/getLoginUserInfo',
        method: 'post',
        data: params,
    })
}

// 提交
export function submitForAddOrUpdate(id) {
    return requirt({
        url: `/tScyxJlglFxjygl/analyseCheckoutSubmit?id=${id}`,
        method: 'get',
        // data: params,
    })
}

// 确认提交
export function affirm(id) {
    return requirt({
        url: `/tScyxJlglFxjygl/affirm?id=${id}`,
        method: 'get',
        // data: params,
    })
}

// 审批
export function monthPlanAudio(params) {
    return requirt({
        url: '/tScyxJlglFxjygl/analyseCheckoutAudio',
        method: 'get',
        params: params,
    })
}

