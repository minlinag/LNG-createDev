import requirt from '@/utils/request'
// 获取通知单列表
export function getListPage(params){
    return requirt({
        url:'/notice/getListForPage',
        method:'post',
        data:params,
    })
}
// 添加通知单列表
export function addListForPage(params){
    return requirt({
        url:'/overhaulPlanController/addJsonWithAtt',
        method:'post',
        data:params,
    })
}
// 修改通知单列表
export function upDateistForPage(params){
    return requirt({
        url:'/overhaulPlanController/updateJsonWithAtt',
        method:'post',
        data:params,
    })
}
// 修改通知单列表
export function updateJsonWithAtt(params){
    return requirt({
        url:'/notice/updateJsonWithAtt',
        method:'post',
        data:params,
    })
}
// 不带JSON修改通知单

export function updateWithAtt(params){
    return requirt({
        url:'/notice/update',
        method:'post',
        data:params,
    })
}
// 获取相关作业票
export function getSelect(params){
    return requirt({
        url:'/operationApplication/getAllApprovalApplicationId',
        method:'get',
        params:params,
    })
}

//删除通知单
export function deleteList(params){
    return requirt({
        url:'/notice/delete',
        method:'delete',
        data:params,
    })
}

export function oversubmit(params){
    return requirt({
        url: '/overhaulPlanController/submit',
        method: 'get',
        params: params,
    })
}

export function overaudio(params){
    return requirt({
        url: '/overhaulPlanController/audio',
        method: 'get',
        params: params,
    })
}

export function noticeSubmit(params){
    return requirt({
        url: '/notice/noticeSubmit',
        method: 'get',
        params: params,
    })
}


export function noticeAudio(params){
    return requirt({
        url: '/notice/noticeAudio',
        method: 'get',
        params: params,
    })
}


export function addVerification(params){
    return requirt({
        url: '/notice/addVerification',
        method: 'post',
        data: params,
    })
}
//验工提交
export function noticeYsSubmit(params){
    return requirt({
        url: '/notice/noticeYsSubmit',
        method: 'get',
        params: params,
    })
}

//验收审批
export function noticeYsAudio(params){
    return requirt({
        url: '/notice/noticeYsAudio',
        method: 'get',
        params: params,
    })
}
//historyList 获取历史审批记录
export function historyList(params){
    return requirt({
        url: '/workflow/historyList',
        method: 'get',
        params: params,
    })
}
