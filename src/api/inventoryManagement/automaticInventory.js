import requirt from '@/utils/request'
// 获取列表
export function getList(params){
    return requirt({
        url:'/AutoInventory/findAllByCondition',
        method:'get',
        params:params,
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

// 修改子表
export function update(list){
    return requirt({
        url:'/tScyxJlglYjpk/update',
        method:'post',
        data: list,
    })
}

// 提交
export function submit(id){
    return requirt({
        url:'/AutoInventory/zjpkSubmit',
        method:'get',
        params: { id:id,},
    })
}
