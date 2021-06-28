export default {
  async fetchUser({ commit, state }) {
    let a = {}
    console.log('fetching user')
    let payload = {
      token: this.$auth.getToken('github'),
      userid: 6
    }
    a = await this.$userEndpoint.index(payload)
    commit('SET_USER', a.user.person)
    commit('SET_USER_ID', a.user.id)
    commit('SET_ORG', a.user.organization)
  },
  async setUserId({ commit }, user_id) {
    commit('SET_USER_ID', user_id)
  }
}
