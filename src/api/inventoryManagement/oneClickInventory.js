import requirt from '@/utils/request'

// 获取主列表
export function getList(params){
    return requirt({
        url:'/tScyxJlglYjpk/getListForPage',
        method:'get',
        params:params,
    })
}

export function selectById(id){
    return requirt({
        url:`/tScyxJlglYjpk/selectById?id=${id}`,
        method:'get',
    })
}



// 根据开始时间结束时间查询库存数据
export function getDetailsListByTime(startTime, endTime){
    return requirt({
        url:'/tScyxJlglYjpk/queryZdpkByTime',
        method:'get',
        params:{startTime:startTime, endTime:endTime},
    })
}

//添加主表和子表
export function addMainAndDetails(params){
    return requirt({
        url:'/tScyxJlglYjpk/add',
        method:'post',
        data:params,
    })
}

// 获取子表
export function getDetailsListBySerialNo(serialNo){
    return requirt({
        url:'/AutoInventory/selectByNo',
        method:'get',
        params: { pageNum:'1',pageSize:'9999',serialNo:serialNo},
    })
}

// 修改
export function update(list){
    return requirt({
        url:'/tScyxJlglYjpk/update',
        method:'post',
        data: list,
    })
}

// 批量删除
export function deleteByIds(ids){
    return requirt({
        url:'/tScyxJlglYjpk/delete',
        method:'delete',
        data: ids,
    })
}

//开启流程
export function submit(id) {
    return requirt({
        url: '/tScyxJlglYjpk/automaticInventoryingSubmit',
        method: 'get',
        params: {id:id},
    })
}

//审批
export function approval(params) {
    return requirt({
        url: '/tScyxJlglYjpk/automaticInventoryingAudio',
        method: 'get',
        params: params,
    })
}