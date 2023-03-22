const state = {
  progress: Number,
  show: false,
}

const mutations = {
  EDIT_PROGRESS_STATE: (state, view) => {
    state.progress = (view.loaded / view.total).toFixed(2) * 100
  },
  MAKE_ZERO: (state, view) => {
    state.progress = view
  },
  PROGRESS_SHOW: (state, view) => {
    state.show = view
  },
}
const actions = {
  progressState({ commit }, view) {
    commit('EDIT_PROGRESS_STATE', view)
  },
  makeZero({ commit }, view) {
    commit('MAKE_ZERO', view)
  },
  progressShow({ commit }, view) {
    commit('PROGRESS_SHOW', view)
  },
}
export default {
  state,
  mutations,
  actions,
  namespaced: true,
}