import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lodash from 'lodash';
// import Print from 'vue-print-nb'
import echarts from 'echarts';
import './utils/jurisdiction'
import audit from './utils/audit'
import fileUploadJSON from './utils/fileUploadJSON'
import './assets/icons'
import './permission'
import components from './utils/components';
import jsFileDownload from 'js-file-download';
Vue.use(components)
// 引入Antd
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import Print from 'vue-print-nb'
import './assets/css/base.css';
import './assets/css/base.less';
import './assets/css/customizeButton.less'
import printPage from './utils/printPage'
Vue.config.productionTip = false;
Vue.use(Antd);
// Global instruction
Vue.use(Print);
Vue.use(printPage);

console.log(Vue)
console.log(Vue.prototype.$printPage)
import { tableRow } from "@/utils/tableFun"

Vue.prototype.$echarts = echarts;
Vue.prototype.$tableRow = tableRow //引入组件
Vue.prototype.$lodash = lodash
Vue.prototype.$audit = audit
Vue.prototype.$fileUploadJSON = fileUploadJSON
Vue.prototype.$jsFileDownload = jsFileDownload
// // 增加混入
// import shareUtils from "@/mixins/utils";
// Vue.mixin(shareUtils);

// 过滤器
import * as filters from './utils/util'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 将自动注册所有组件为全局组件
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)

//导入
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

router.afterEach(() => {
  NProgress.done()
})

Vue.config.productionTip = false
let newVue = new Vue({
  router,
  store,
  render: h => h(App),
  data: {
    // 空的实例放到根组件下，所有的子组件都能调用
    Bus: new Vue()
  }
}).$mount('#app')

export default newVue


