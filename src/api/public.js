import requirt from '@/utils/request'
import store from '@/store'
// 获取按钮参数
export function getAuthButtonByPageCode(params) {
  return requirt({
    url: '/system/auth/getAuthButtonByPageCode',
    method: 'get',
    params: params,
  })
}

// 字典数据获取
export function encode(params) {
  return requirt({
    url: `/dict/dictList/${params}`,
    methods: 'get',
  })
}

// 获取当前用户数据
export function getLoginUserInfo(data) {
  return requirt({
    url: '/system/user/getLoginUserInfo',
    method: 'post',
    data
  })
}

// 上传文件接口
export function uploadMultiFile(data, callback) {
  return requirt({
    url: '/fileinfo/uploadMultiFile',
    method: 'post',
    data,
    onUploadProgress: progressEvent => {
      if (progressEvent.lengthComputable) {
        callback && callback(progressEvent);
      }
    }
  })
}

// 下载文件接口
export function downloadFileById(params) {
  return requirt({
    url: '/fileinfo/downloadFileById',
    method: 'get',
    params: params,
    responseType: 'blob',
  })
}