import Vue from 'vue'
import { Modal } from "ant-design-vue";

import { getAuthButtonByPageCode } from '@/api/system'

// getAuthButtonByPageCode().then((res)=>{
//   console.log(res,12312)
// })

Modal.props.getContainer.default = () => document.getElementById('app')

Vue.directive('Add', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // console.log(el,123)
    // 聚焦元素
    //   el.focus()  // 页面加载完成之后自动让输入框获取到焦点的小功能
  }
})


Vue.directive('Delete', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // console.log(el,123)
    // 聚焦元素
    //   el.focus()  // 页面加载完成之后自动让输入框获取到焦点的小功能
  }
})

Vue.directive('Edit', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // console.log(el,123)
    // 聚焦元素
    //   el.focus()  // 页面加载完成之后自动让输入框获取到焦点的小功能
  }
})

Vue.directive('Query', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // console.log(el,123)
    // 聚焦元素
    //   el.focus()  // 页面加载完成之后自动让输入框获取到焦点的小功能
  }
})