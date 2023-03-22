import requirt from '@/utils/request'

//分页查询
export function getListForPage(params) {
    return requirt({
        url: '/unloadingMeasure/getListForPage',
        method: 'post',
        data: params,
    })
}

//分页查询
export function getUnloadingMeasureById(id) {
    return requirt({
        url: '/unloadingMeasure/getUnloadingMeasureById',
        method: 'post',
        params: { id: id },

    })
}

//新增
export function add(params) {
    return requirt({
        url: '/unloadingMeasure/add',
        method: 'post',
        data: params,
    })
}

//新增（带附件）
export function addWithAtt(params) {
    return requirt({
        url: '/unloadingMeasure/addWithAtt',
        method: 'post',
        data: params,
    })
}

//修改
export function edit(params) {
    return requirt({
        url: '/unloadingMeasure/update',
        method: 'post',
        data: params,
    })
}

//修改（带附件）
export function editWithAtt(params) {
    return requirt({
        url: '/unloadingMeasure/updateWithAtt',
        method: 'post',
        data: params,
    })
}

//查询默认数据
export function queryShipNo() {
    return requirt({
        url: '/unloadingMeasure/queryShipNo',
        method: 'get',
    })
}

//删除
export function deletes(params) {
    return requirt({
        url: '/unloadingMeasure/delete',
        method: 'delete',
        data: params,
    })
}

//性质下拉数据
export function getdict(params) {
    return requirt({
        url: '/dict/dictList/' + params,
        method: 'get',
    })
}


