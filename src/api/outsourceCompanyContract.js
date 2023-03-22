import requirt from '@/utils/request'
//获取页面
export function getContractListForPage(params){
    return requirt({
        url:'/wwdwhtgl/getListForPage',
        method:'post',
        data:params,
    })
}
//删除外委单位合同
export function mydelete(params){
    return requirt({
        url:'/wwdwhtgl/delete',
        method:'delete',
        data:params,
    })
}
//添加外委单位
export function add(params){
    return requirt({
        url:'/wwdwhtgl/addWihtAtt',
        method:'post',
        data:params,
    })
}

export function getOneById(params){
    return requirt({
        url:'/wwdwhtgl/getOneById/${params}',
        method:'get',
    })
}

export function getCodeById(params){
    return requirt({
        url: `/wwdwgl/getOneById/${params}`,
        methods: 'get',
    })
}
//修改更新外委单位
export function update(params){
    return requirt({
        url:'/wwdwhtgl/update',
        method:'post',
        data:params,
    })
}
