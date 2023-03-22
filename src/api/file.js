import requirt from '@/utils/request'


// 根据RelatedId查询附件
export function queryFileByRelatedId(relatedId) {
    return requirt({
        url: '/fileinfo/downloadFile',
        method: 'get',
        params: { 'relatedId': relatedId },
    })
}

//根据业务id和编码返回单个文件的blob格式文件
export function getBase64StrByBusiness(params) {
    console.log(params);
    return requirt({
        url: '/fileinfo/getBase64StrByBusiness',
        method: 'get',
        params: params,
    })
}