// zxt 设备检维修管理 待检定页面
import  request from '@/utils/request'

// 待检定==>临时检定==>设备列表
export function selectTemporaryCon(params){
    return request({
        url: '/applicationForm/selectTemporaryCon',
        method: 'post',
        data:params,
    })
}

// 临时检定
export function insert(params){
  return request({
      url: '/applicationForm/insert',
      method: 'post',
      data:params,
  })
}

// 上传证书
export function insertCertificate(params){
  return request({
      url: '/verificationPlanMinute/insertCertificate',
      method: 'post',
      data:params,
  })
}
