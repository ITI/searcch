export default {
  async fetchUser({ commit, state }) {
    let a = {}
    console.log('fetching user')
    let payload = {
      token: this.$auth.getToken('github'),
      userid: state.user_id
    }
    a = await this.$userEndpoint.index(payload)
    commit('SET_USER', a.user)
  },
  async setUsername({ commit }, user) {
    commit('SET_USERNAME', user.person.name)
  },
  async setUserId({ commit }, user_id) {
    commit('SET_USERID', user_id)
  }
}
