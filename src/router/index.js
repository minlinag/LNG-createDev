import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: '首页',
  component: () =>
    import( /* webpackChunkName: "page" */ '@/layout/index'),
  meta: {
    requireAuth: true,
  },
  children: []
},
]
// this.$store.dispatch('setting/menuListSet', asyncRouters)  

// options.routes

const asyncRoutes = []
const modulesFiles = require.context('./modules', true, /\.js$/)
modulesFiles.keys().forEach(key => {
  let moduleObj = modulesFiles(key).default
  if (!Array.isArray(moduleObj)) {
    moduleObj = [moduleObj];
  }
  moduleObj.forEach(item => {
    routes[0].children.push(item);
  })
})
const router = new VueRouter({
  // 页面刷新白屏问题
  mode: 'history',
  base: process.env.NODE_ENV === "development" ? process.env.BASE_URL : Glod.SERVER_CONTEXT,
  routes,
})

export default router