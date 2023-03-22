const state = {
  spinning: false,
  postTimes: 0
}

const mutations = {
  SPINNING_STATE: (state, view) => {
    if (view) {
      state.postTimes += 1
    } else {
      state.postTimes -= 1
    }
    if (state.postTimes > 0) {
      state.spinning = true
    } else {
      state.spinning = false
    }

  },
}
const actions = {
  spinningState({ commit }, view) {
    commit('SPINNING_STATE', view)
  },
}
export default {
  state,
  mutations,
  actions,
  namespaced: true,
}