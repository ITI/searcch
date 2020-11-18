export default {
  async setUsername({ commit }, user) {
    commit('SET_USERNAME', user)
  },
  async setUserId({ commit }, user_id) {
    commit('SET_USER_ID', user_id)
  }
}
