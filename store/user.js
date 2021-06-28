import Vue from 'vue'

export const state = () => ({
  user: null,
  user_id: 6,
  organization: null,
  user_token: null
})

export const getters = {
  user: state => {
    return state.user
  },
  organization: state => {
    return state.organization
  },
  name: state => {
    return state.user.name
  },
  user_token: state => {
    return state.user_token
  },
  user_id: state => {
    return state.user_id
  }
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_ORG(state, org) {
    state.organization = org
  },
  SET_USER_TOKEN(state, user_token) {
    state.user_token = user_token
  },
  SET_USER_ID(state, user_id) {
    state.user_id = user_id
  },
  LOGOUT(state) {
    state.user = null
    state.organization = null
    state.user_token = null
    state.user_id = null
  }
}

export const actions = {
  async fetchUser({ commit, state }) {
    let a = {}
    console.log('fetching user')
    // FIXME: remove when backend change made
    let payload = {
      token: this.$auth.getToken('github'),
      userid: 6
    }
    a = await this.$userEndpoint.index(payload)
    commit('SET_USER', a.user.person)
    commit('SET_USER_ID', a.user.id)
    commit('SET_ORG', a.user.organization)
  },
  async setUserToken({ commit }, user_token) {
    commit('SET_USER_TOKEN', user_token)
  }
}
