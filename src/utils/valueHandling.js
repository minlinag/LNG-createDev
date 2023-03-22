// 深拷贝
export function deepClone(obj) {
  let newObj;

  if (obj instanceof Array) {
    newObj = []
    let i = obj.length;
    while (i--) {
      newObj[i] = deepClone(obj[i])
    }
    return newObj
  }

  else if (obj instanceof Object) {
    newObj = {}
    for (let key in obj) {
      newObj[key] = deepClone(obj[key])
    }
    return newObj
  }

  else {
    return obj
  }
}