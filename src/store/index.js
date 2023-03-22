import Vue from 'vue'
import Vuex from 'vuex'
import setting from './modules/setting.js'
import permission from './modules/permission.js'
import user from './modules/user'
import progress from './modules/progress'
import spin from './modules/spin'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {
  },
  actions: {
  },
  modules: {
    setting,
    permission,
    user,
    progress,
    spin
  }
})
