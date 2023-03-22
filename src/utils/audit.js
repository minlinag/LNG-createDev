import store from '@/store'

const audit = {
  editDisabled: ((status) => {
    if (['2', '3', '4', '6', '7', '8'].includes(status)) {
      return true
    } else {
      return false
    }
  }),
  editDisabledProduction: ((status, userid) => {
    let Statu = ['2', '3', '4', '6', '7', '8'].includes(status)
    let SuserId = store.state.user.userId == userid ? false : true
    let show = Statu ? true : SuserId ? true : false
    return show
  }),
  auditDisabled: ((toDoUserCode) => {
    // console.log('auditDisabled','toDoUserCode',toDoUserCode);
    if (toDoUserCode) {
      let codeArray = toDoUserCode.split(",")
      // console.log('auditDisabled','userCode',store.state.user.userCode);
      if (codeArray.includes(store.state.user.userCode)) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }),
  dispatchDisabled: ((status) => {
    if (['4'].includes(status)) {
      return false
    } else {
      return true
    }
  }),
  dispatchUserId: ((createdUserId) => {
    if (createdUserId) {
      let codeArray = createdUserId.split(",")
      if (codeArray.includes(store.state.user.userId+'')) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }),
  // 过滤URL传参中的undefined，null参数
  fiflterUrlData: ((data) => {
    const transformData = data;
    if (typeof transformData === 'object' && transformData !== null) {
      for (const [k, v] of Object.entries(transformData)) {
          if (v === null || v === undefined) {
              delete transformData[k];
          }
      }
    return transformData
    }
  }),
  // 编辑/删除按钮权限，状态为1或8的时候可用，其他状态禁用
  editDisabledChain: ((recordStatus) => {
    if (['1'].includes(recordStatus)) {
      return false
    } else if (['8'].includes(recordStatus)) {
      return false
    }
    else {
      return true
    }
  }),
  // 编辑/删除按钮权限，当前用户为该数据创建人时可用，其他禁用
  chainUserId: ((createdUser) => {
    if (createdUser == store.state.user.name) {
      return false
    } else {
      return true
    }
  }),
};
export default audit