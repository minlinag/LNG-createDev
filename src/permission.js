import router from './router'
import store from './store'
import { getAuthButtonByPageCode } from './api/public'
router.beforeEach((to, from, next) => {
  const data = to
  let buttonData = []
  if (data.query.hasOwnProperty('pageCode')) {

    let pageCode = data.query.pageCode
    getAuthButtonByPageCode({ pageCode }).then((res) => {
      buttonData = res.body.data
      store.dispatch('permission/butttonState', buttonData)
    })
    // 接口请求
  } else {
    buttonData = [
      {
        "value": "Add",
        "name": "新增",
        "enabled": "true"
      },
      {
        "value": "Maintain",
        "name": "维护",
        "enabled": "true"
      },
      {
        "value": "Report",
        "name": "上报",
        "enabled": "true"
      },
      {
        "value": "Edit",
        "name": "编辑",
        "enabled": "true"
      },
      {
        "value": "Affirm",
        "name": "确认",
        "enabled": "true"
      },
      {
        "value": "Delete",
        "name": "删除",
        "enabled": "true"
      },
      {
        "value": "VERIFY",
        "name": "审批",
        "enabled": "true"
      },
      {
        "value": "Back",
        "name": "意见反馈",
        "enabled": "true"
      },
      {
        "value": "Issue",
        "name": "下发",
        "enabled": "true"
      },
      {
        "value": "Verify",
        "name": "验收",
        "enabled": "true"
      },
      {
        "value": "SUBMIT",
        "name": "提交",
        "enabled": "true"
      }, {
        "value": "importComponent",
        "name": "导入",
        "enabled": "true"
      }, {
        "value": "exportComponent",
        "name": "导出",
        "enabled": "true"
      }, {
        "value": "Copy",
        "name": "复制",
        "enabled": "true"
      }

    ]
    store.dispatch('permission/butttonState', buttonData)
  }
  if (!store.state.user.userId) {
    store.dispatch("getUser")
  }

  // if (condition) {

  // }


  next()
})

router.afterEach(() => {

})
