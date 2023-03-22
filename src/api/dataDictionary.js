import requirt from '@/utils/request'
export function datadictionary(params){
    return requirt({
        url: '/dict/getTree',
        methods: 'get',
        params: params,
    })
}
export function encode(params){
    return requirt({
        url: `/dict/dictList/${params}`,
        methods: 'get',
    })
}
// 新增接口
export function dictPost(params){
    return requirt({
        url: '/dict/addDict',
        method: 'post',
        data:params
    })
}


// 修改接口
export function dictPut(params){
    return requirt({
        url: '/dict/updateDict',
        method: 'PUT',
        data:params
    })
}

// 删除接口
export function dictDelete(params){
    return requirt({
        url: '/dict/deleteDict',
        method: 'delete',
        data:params
    })
}
export function encodetreedata(params){
    return requirt({
        url: `/dict/selfAndChildDict/${params}`,
        methods: 'get',
    })
}

export function dictlist(params){
    return requirt({
        url: '/dict/dictList',
        methods: 'get',
        params: params,
    })
}
export function encodelevel(params){
    return requirt({
        url: '/dict/findAllChildDictByDictCode',
        methods: 'get',
        params: params,
    })
}


export function eqmMasterData(params){
    return requirt({
        url: '/mdm/eqmMasterData',
        method: 'psot',
        data: params,
    })
}


