import requirt from '@/utils/request'
//年度/月度查看对应备品备件
export function getListById(params){
    console.log(params,"qwioueewqoiu")
    return requirt({
        url: '/bpbjqd/getListById',
        method: 'get',
        params: params,
    })
}
//分页查询备品备件清单信息
export function getListForSparepart(params){
    return requirt({
        url: '/bpbjqd/getListForPage',
        method: 'post',
        data: params,
    })
}

// 分页根据ID集合查询备品备件清单信息
export function getIdListForSparepart(params){
    return requirt({
        url: '/bpbjqd/getIdListForPage',
        method: 'post',
        data: params,
    })
}

// 根据ID 或许备品备件
export function selectByIds(params){
    return requirt({
        url: '/bpbjqd/selectByIds',
        method: 'post',
        data: params,
    })
}