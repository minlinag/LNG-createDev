import requirt from '@/utils/request'

//分页查询冷能耗气月报记录
export function getListForPage(params) {
    return requirt({
        url: '/lnhqyb/findList',
        method: 'get',
        params: params,
    })
}

//根据id查询单条
export function findById(params) {
    return requirt({
        url: '/lnhqyb/findById',
        method: 'get',
        params: params,
    })
}

//新增
export function update(params) {
    return requirt({
        url: '/lnhqyb/editById',
        method: 'post',
        data: params,
    })
}

//新增
export function add(params) {
    return requirt({
        url: '/lnhqyb/add',
        method: 'post',
        data: params,
    })
}

//新增带附件
export function addWithAtt(params) {
    return requirt({
        url: '/lnhqyb/addWithAtt',
        method: 'post',
        data: params,
    })
}

//修改带附件
export function updateWithAtt(params) {
    return requirt({
        url: '/lnhqyb/updateWithAtt',
        method: 'post',
        data: params,
    })
}

//删除
export function deletes(params) {
    return requirt({
        url: '/lnhqyb/deleteByIds',
        method: 'delete',
        data: params,
    })
}

//开启流程 并签名
export function submitAndSign(params) {
    return requirt({
        url: '/lnhqyb/submitAndSign',
        method: 'post',
        data: params,
    })
}

//审批 并签名
export function audioAndSign(params) {
    return requirt({
        url: '/lnhqyb/audioAndSign',
        method: 'post',
        data: params,
    })
}

//冷能耗气管理开启流程
export function submit(id) {
    return requirt({
        url: '/lnhqyb/coldEnergyConsumSubmit',
        method: 'get',
        params: { id: id },
    })
}

//冷能耗气管理审批
export function approval(params) {
    return requirt({
        url: '/lnhqyb/coldEnergyConsumAudio',
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