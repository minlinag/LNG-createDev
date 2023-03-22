import requirt from '@/utils/request'

//分页查询冷能计量月报记录
export function getListForPage(params) {
    return requirt({
        url: '/lnjlyb/getListForPage',
        method: 'post',
        data: params,
    })
}
// 根据ID查询
export function getById(id) {
    return requirt({
        url: `/lnjlyb/getById?id=${id}`,
        method: 'get',
    })
}


//新增不带附件
export function add(params) {
    return requirt({
        url: '/lnjlyb/add',
        method: 'post',
        data: params,
    })
}

//新增带附件
export function addWihtAtt(params) {
    return requirt({
        url: '/lnjlyb/addWihtAtt',
        method: 'post',
        data: params,
    })
}

//修改
export function update(params) {
    return requirt({
        url: '/lnjlyb/update',
        method: 'post',
        data: params,
    })
}

//删除
export function deletes(params) {
    return requirt({
        url: '/lnjlyb/delete',
        method: 'post',
        data: params,
    })
}

//开启流程 并签名
export function submitAndSign(params) {
    return requirt({
        url: '/lnjlyb/submitAndSign',
        method: 'post',
        data: params,
    })
}

//审批 并签名
export function audioAndSign(params) {
    return requirt({
        url: '/lnjlyb/audioAndSign',
        method: 'post',
        data: params,
    })
}

//开启流程
export function submit(id) {
    return requirt({
        url: '/lnjlyb/submit',
        method: 'get',
        params: { id: id },
    })
}

//审批
export function approval(params) {
    return requirt({
        url: '/lnjlyb/audio',
        method: 'get',
        params: params,
    })
}

//单位下拉数据
export function getCompanyList() {
    return requirt({
        url: '/yhxxbd/getCompanyList',
        method: 'post',
    })
}

