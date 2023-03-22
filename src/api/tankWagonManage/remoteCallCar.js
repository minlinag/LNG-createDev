import requirt from '@/utils/request'

// 获取当日叫车详情列表
export function queryListForDay(params) {
    return requirt({
        url: '/remoteCallCar/queryListForDay',
        method: 'get',
        params: params,
    })
}

// 获取当日车辆统计情况
export function queryCarStatForDay(params) {
    return requirt({
        url: '/remoteCallCar/queryCarStatForDay',
        method: 'get',
        params: params,
    })
}

// 主列表查询
export function findListByDay(params) {
    return requirt({
        url: '/lngSales/findListByDay',
        method: 'get',
        params: params,
    })
}

// 根据主表id查询详情
export function selectDetailsById(id) {
    return requirt({
        url: '/lngSales/selectById',
        method: 'get',
        params: {id:id},
    })
}

// 当日计划完成情况
export function completionOfTheDay() {
    return requirt({
        url: '/lngSales/completionOfTheDay',
        method: 'get',
    })
}

// 远程叫车
export function callCar(params) {
    return requirt({
        url: '/remoteCallCar/callCar',
        method: 'post',
        data: params,
    })
}

// 取消装车
export function cancelLoading(params) {
    return requirt({
        url: '/lngSales/cancelLoading',
        method: 'get',
        params: params,
    })
}

