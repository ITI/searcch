import Vue from 'vue'

export const state = () => ({
  user: null,
  userid: null,
  user_can_admin: false,
  user_is_admin: false,
  organization: [],
  orgs: [],
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
  user_can_admin: state => {
    return state.user_can_admin
  },
  user_is_admin: state => {
    return state.user_is_admin
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
  SET_USER_ORGS(state, orgs) {
    state.organization = orgs
  },
  SET_USER_TOKEN(state, user_token) {
    state.user_token = user_token
  },
  SET_USERID(state, userid) {
    state.userid = userid
  },
  SET_USER_IS_ADMIN(state, user_is_admin) {
    state.user_is_admin = user_is_admin
  },
  SET_USER_CAN_ADMIN(state, user_can_admin) {
    state.user_can_admin = user_can_admin
  },
  SET_ORGS(state, orgs) {
    state.orgs = orgs
  },
  SET_INTERESTS(state, interests) {
    state.interests = interests
  },
  LOGOUT(state) {
    state.user = null
    state.organization = []
    state.orgs = []
    state.interests = null
    state.user_token = null
    state.userid = null
    state.user_is_admin = false
    state.user_can_admin = false
  },
  ADMIN_OFF(state) {
  }
}

export const actions = {
  async fetchUser({ commit, state }) {
    let response = {}
    console.log('fetching user')
    response = await this.$userEndpoint.index()
    commit('SET_USER', response.user.person)
    commit('SET_USERID', response.user.id)
    commit('SET_USER_CAN_ADMIN', response.user.can_admin)
    commit('SET_USER_IS_ADMIN', response.user.is_admin)
    commit('SET_USER_ORGS', response.user.affiliations)
  },
  async setUserToken({ commit }, user_token) {
    commit('SET_USER_TOKEN', user_token)
  },
  async fetchOrgs({ commit, state }) {
    if (typeof state.orgs === 'object' && state.orgs.length > 0) {
      return
    }
    let response = {}
    console.log('fetching organizations')
    let payload = {
      verified: 1,
      all: 1
    }
    response = await this.$organizationEndpoint.index(payload)
    commit('SET_ORGS', response.organizations)
  },
  async fetchInterests({ commit, state }) {
    let response = {}
    console.log('fetching interests')
    let payload = {
      all: 1
    }
    response = await this.$interestsEndpoint.index(payload)
    commit('SET_INTERESTS', response.research_interests)
  }
}
