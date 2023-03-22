import CryptoJS from './crypto-js'
/**
 *加密处理
 */
export const encryption = (params) => {
  let {
    data,
    type,
    param,
    key
  } = params
  const result = JSON.parse(JSON.stringify(data))
  if (type === 'Base64') {
    param.forEach(ele => {
      result[ele] = btoa(result[ele])
    })
  } else {
    param.forEach(ele => {
      var data = result[ele]
      key = CryptoJS.enc.Latin1.parse(key)
      var iv = key
      // 加密
      var encrypted = CryptoJS.AES.encrypt(
        data,
        key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
      })
      result[ele] = encrypted.toString()
    })
  }
  return result
}

export function filterTime(time) {
  let newTime = ''
  if (time == null || time == undefined || !time) {
    newTime = null
  } else {
    const date = new Date(time)
    const Y = date.getFullYear()
    const M =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1
    const D = date.getDate() < 10
      ? '0' + (date.getDate())
      : date.getDate()
    newTime = `${Y}-${M}-${D}`
    console.log(newTime, "newTime");
    console.log(time, "time");
  }

  return newTime
}

/**
 * 获取token 查看token是否存在
 */
