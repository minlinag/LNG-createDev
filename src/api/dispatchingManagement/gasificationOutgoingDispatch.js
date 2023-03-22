/**
 * 气化外输调度令
 * zhangxiaoyang
 * 2022-10-13
 */
import requirt from '@/utils/request'

//分页查询
export function getList(params) {
    return requirt({
        url: '/po/sm/gasOutputTransfer/pageList',
        method: 'get',
        params: params,
    })
}

//根据id查询详情
export function getDetailById(params) {
    return requirt({
        url: '/po/sm/gasOutputTransfer/queryDetailById',
        method: 'get',
        params: params,
    })
}

//获取调度令名称，当前日期-两位流水码
export function queryTransferName(params) {
    return requirt({
        url: '/po/sm/gasOutputTransfer/queryTransferName',
        method: 'get',
        params: params,
    })
}


//新增或者修改数据-保存操作
export function saveForAddOrUpdate(params) {
    return requirt({
        url: '/po/sm/gasOutputTransfer/saveForAddOrUpdate',
        method: 'post',
        data: params,
    })
}

//新增或者修改数据-提交操作
export function submitForAddOrUpdate(params) {
    return requirt({
        url: '/po/sm/gasOutputTransfer/submitForAddOrUpdate',
        method: 'post',
        data: params,
    })
}


//关闭按钮-保存或者提交动作
export function updateForCloseOpr(params) {
    return requirt({
        url: '/po/sm/gasOutputTransfer/updateForCloseOpr',
        method: 'post',
        data: params,
    })
}

//删除数据
export function deletes(params) {
    return requirt({
        url: '/po/sm/gasOutputTransfer',
        method: 'delete',
        data: params,
    })
}

//更新数据
export function gasOutputTransfer(params) {
    return requirt({
        url: '/po/sm/gasOutputTransfer',
        method: 'put',
        data: params,
    })
}

//根据所选时间和点位获取当前气化外输量
export function queryCurrOutputFromRtdb(params) {
    return requirt({
        url: '/po/sm/gasOutputTransfer/queryCurrOutputFromRtdb',
        method: 'post',
        data: params,
    })
}




