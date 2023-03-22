import requirt from '@/utils/request'

//分页查询
export function getListForPage(params) {
    return requirt({
        url: '/nhfxZhnh/queryByYear',
        method: 'get',
        params,
    })
}


//提交
export function commit(data) {
    return requirt({
        url: '/nhfxZhnh/submitBatch',
        method: 'post',
        data
    })
}

//审批
export function approval(params) {
    return requirt({
        url: '/nhfxZhnh/audio',
        method: 'get',
        params,
    })
}
