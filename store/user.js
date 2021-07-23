import Vue from 'vue'

export const state = () => ({
  user: null,
  userid: null,
  organization: null,
  orgs: null,
  user_token: null,
  interests: null
})

export const getters = {
  user: state => {
    return state.user
  },
  organization: state => {
    return state.organization
  },
  orgs: state => {
    return state.orgs
  },
  name: state => {
    return state.user.name
  },
  user_token: state => {
    return state.user_token
  },
  userid: state => {
    return state.userid
  },
  interests: state => {
    return state.interests
  }
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_NAME(state, name) {
    state.user.name = name
  },
  SET_WEBSITE(state, website) {
    state.user.website = website
  },
  SET_USER_INTERESTS(state, interests) {
    state.user.research_interests = interests
  },
  SET_USER_ORG(state, org) {
    state.organization = org
  },
  SET_USER_TOKEN(state, user_token) {
    state.user_token = user_token
  },
  SET_USERID(state, userid) {
    state.userid = userid
  },
  SET_ORGS(state, orgs) {
    state.orgs = orgs
  },
  SET_INTERESTS(state, interests) {
    state.interests = interests
  },
  LOGOUT(state) {
    state.user = null
    state.organization = null
    state.orgs = null
    state.interests = null
    state.user_token = null
    state.userid = null
  }
}

export const actions = {
  async fetchUser({ commit, state }) {
    let a = {}
    console.log('fetching user')
    a = await this.$userEndpoint.index()
    commit('SET_USER', a.user.person)
    commit('SET_USERID', a.user.id)
    commit('SET_USER_ORG', a.user.organization)
  },
  async setUserToken({ commit }, user_token) {
    commit('SET_USER_TOKEN', user_token)
  },
  async fetchOrgs({ commit, state }) {
    if (state.orgs !== null && state.orgs.length > 0) {
      return
    }
    let a = {}
    console.log('fetching organizations')
    let payload = {
      verified: 1,
      all: 1
    }
    a = await this.$organizationEndpoint.index(payload)
    commit('SET_ORGS', a.organizations)
  },
  async fetchInterests({ commit, state }) {
    let a = {}
    console.log('fetching interests')
    let payload = {
      all: 1
    }
    a = await this.$interestsEndpoint.index(payload)
    commit('SET_INTERESTS', a.research_interests)
  }
}
