import requirt from '@/utils/request'
/*****
 *
 * .....设备列表 2022.8.12 刘豪东
 *
 * *****/
// 获取检测计划列表
export function getList(params){
    return requirt({
        url: '/eqmlubricationManager/findTableList',
        method: 'get',
        params: params,
    })
}
// 添加检测计划列表
export function addList(params){
    return requirt({
        url: '/TemMainPlan/add',
        method: 'post',
        data: params,
    })
}

//修改检测计划列表
export function upDateList(params){
    return requirt({
        url: '/TemMainPlan/update',
        method: 'post',
        data: params,
    })
}
//修改检测计划列表
export function getdict(params){
    return requirt({
        url: '/dict/dictList/SBGL-JH-ZYSSQY',
        method: 'get',
        params: params,
    })
}

//导出EXCEL表
export function exportExcel(params){
    return requirt({
        url: '/eqmlubricationManager/exportExcel',
        method: 'get',
        params: params,
    })
}

