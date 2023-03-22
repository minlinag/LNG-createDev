const state = {
  button: []
}

const mutations = {
  EDIT_BUTTON_STATE: (state, view) => {
    // enabled
    // : 
    // "true"
    // name
    // : 
    // "新增"
    // value
    // : 
    // "Add"
    // debugger
    state.button = view
    // debugger
  },
}
const actions = {
  butttonState({ commit }, view) {
    commit('EDIT_BUTTON_STATE', view)
  },
}
export default {
  state,
  mutations,
  actions,
  namespaced: true,
}