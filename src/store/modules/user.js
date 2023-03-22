import { getLoginUserInfo } from '@/api/public'
const user = {
  state: {
    name: "",
    unitCode: "",
    unitId: "",
    unitName: "",
    userCode: "",
    userId: "",
    idNumber: "",
  },
  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_UNITCODE: (state, unitCode) => {
      state.unitCode = unitCode
    },
    SET_UNITID: (state, unitId) => {
      state.unitId = unitId
    },
    SET_UNITNAME: (state, unitName) => {
      state.unitName = unitName
    },
    SER_USERCODE: (state, userCode) => {
      state.userCode = userCode
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_IDNUMBER: (state, idNumber) => {
      state.idNumber = idNumber
    },
  },

  actions: {
    // 登录
    getUser({ commit }) {
      return new Promise((resolve, reject) => {
        getLoginUserInfo().then((res) => {
          let { name, unitCode, unitId, unitName, userCode, userId, idNumber } = res.body
          commit('SET_NAME', name)
          commit('SET_UNITCODE', unitCode)
          commit('SET_UNITID', unitId)
          commit('SET_UNITNAME', unitName)
          commit('SER_USERCODE', userCode)
          commit('SET_USERID', userId)
          commit('SET_IDNUMBER', idNumber)
        })

      })
    },
  }
}
export default user
