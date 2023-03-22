import requirt from '@/utils/request'

/** 操作卡版本管理 */
//新增 
export function insertSelective(params) {
    return requirt({
        url: '/operationCardVersion/insertSelective',
        method: 'post',
        data: params,
    })
}

//查询
export function selectByCondition(params) {
    return requirt({
        url: '/operationCardVersion/selectByCondition',
        method: 'post',
        data: params,
    })
}

//删除
export function deleteByIds(params) {
    return requirt({
        url: '/operationCardVersion/deleteByIds',
        method: 'post',
        data: params,
    })
}

//编辑
export function updateSelective(params) {
    return requirt({
        url: '/operationCardVersion/updateSelective',
        method: 'post',
        data: params,
    })
}

//获取工艺单元字典表数据
export function getdict() {
    return requirt({
        url: '/dict/dictList/SCYX-CZK-GYDY',
        method: 'get',
    })
}

/** 操作卡归档管理 */
// 查询操作卡归档设备信息
export function selectEqmByVersion(params) {
    return requirt({
        url: '/operationCardVersion/selectEqmByVersion',
        method: 'post',
        params: params,
    })
}

// 查询
export function operationCardGDselect(params) {
    return requirt({
        url: '/operationCardGD/selectByCondition',
        method: 'post',
        data: params,
    })
}

// 删除
export function operationCardGDdelete(params) {
    return requirt({
        url: '/operationCardGD/deleteByIds',
        method: 'post',
        data: params,
    })
}

// 新增
export function operationCardGDinsert(params) {
    return requirt({
        url: '/operationCardGD/insertSelective',
        method: 'post',
        data: params,
    })
}

//编辑
export function operationCardGDupdate(params) {
    return requirt({
        url: '/operationCardGD/updateSelective',
        method: 'post',
        data: params,
    })
}

//归档信息返回
export function operationCardGDgDMessage(params) {
    return requirt({
        url: '/operationCardGD/gDMessage',
        method: 'get',
        data: params,
    })
}

/** 操作卡下载管理 */
// 查询
export function Downloadselect(params) {
    return requirt({
        url: '/operationCardDownload/selectByCreatedUser',
        method: 'get',
        data: params,
    })
}
// 查询详情
export function operationCardDownloadselectById(id) {
    return requirt({
        url: `/operationCardDownload/selectById?id=${id}`,
        method: 'get',
    })
}
// 新增
export function Downloadinsert(params) {
    return requirt({
        url: '/operationCardDownload/insertSelective',
        method: 'post',
        data: params,
    })
}
// 提供操作卡下载信息-非调度令
export function DownloadprovideNo(params) {
    return requirt({
        url: '/operationCardDownload/provideNo',
        method: 'get',
        params: params,
    })
}
// 提供操作卡下载信息-调度令
export function DownloadprovideYes() {
    return requirt({
        url: '/operationCardDownload/provideYes',
        method: 'post',
    })
}
// 一键下载
export function downloadFileZip(relatedIds) {
    return requirt({
        url: `/fileinfo/downloadFileZip?relatedIds=${relatedIds}`,
        method: 'get',
    })
} 