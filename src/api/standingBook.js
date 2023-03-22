import requirt from '@/utils/request'


// 查询接口
export function ledgermasterdata(params) {
    return requirt({
        url: '/mdm/characterMaster/pageList',
        method: 'get',
        params: params,
    })
}


// 新增接口
export function characterMasterPost(params) {
    return requirt({
        url: '/mdm/characterMaster',
        method: 'post',
        data: params
    })
}


// 修改接口
export function characterMasterPut(params) {
    return requirt({
        url: '/mdm/characterMaster',
        method: 'PUT',
        data: params
    })
}

// 删除接口
export function characterMasterDelete(params) {
    return requirt({
        url: '/mdm/characterMaster',
        method: 'delete',

        data: params
    })
}
// 特征分类查询接口
export function featureClassification(params) {
    return requirt({
        url: '/mdm/featureClassific/queryTree',
        method: 'get',
        ContentType: 'application/json',
        params: params
    })
}


//新增特征分类接口
export function featureClassificPost(params) {
    return requirt({
        url: '/mdm/featureClassific',
        method: 'post',
        ContentType: 'application/json',
        data: params
    })
}

//特征分类删除接口
export function featureClassificDelete(params) {
    return requirt({
        url: '/mdm/featureClassific/deleteById',
        method: 'get',
        ContentType: 'application/json',
        params: params
    })
}

// 特征分类编辑分类
export function featureClassificPut(params) {
    return requirt({
        url: '/mdm/featureClassific',
        method: 'put',
        ContentType: 'application/json',
        data: params
    })
}

export function pageListGet(params) {
    return requirt({
        url: '/mdm/featureClassificConfig/pageList/',
        method: 'get',
        ContentType: 'application/json',
        params: params
    })
}

// 特征分类（编辑主数据）删除接口
export function configDeleteBatch(params) {
    return requirt({
        url: '/mdm/featureClassificConfig/configDeleteBatch',
        method: 'DELETE',
        ContentType: 'application/json',
        data: params
    })
}


// 特征主数据编辑查询接口
export function queryPageListForUnClass(params) {
    return requirt({
        url: '/mdm/characterMaster/queryPageListForUnClass',
        method: 'get',
        ContentType: 'application/json',
        params: params
    })
}




// 特征分类配置表
export function configSave(params) {
    return requirt({
        url: '/mdm/featureClassificConfig/configSave',
        method: 'post',
        ContentType: 'application/json',
        data: params
    })
}


// 特征分类配置表
export function configUpdate(params) {
    return requirt({
        url: '/mdm/featureClassificConfig/configUpdate',
        method: 'post',
        ContentType: 'application/json',
        data: params
    })
}



















