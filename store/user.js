import Vue from 'vue'

export const state = () => ({
  user: null,
  userid: null,
  user_can_admin: false,
  user_is_admin: false,
  organization: [],
  orgs: [],
  badges: [],
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
  position: state =>{
    return state.user.position
  },
  orgs: state => {
    return state.orgs
  },
  badges: state => {
    return state.badges
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
  SET_BADGES(state, badges) {
    state.badges = badges
  },
  SET_INTERESTS(state, interests) {
    state.interests = interests
  },
  SET_POSITION(state, position){
    state.user.position = position
  },
  LOGOUT(state) {
    state.user = null
    state.organization = []
    state.orgs = []
    state.badges = []
    state.interests = null
    state.user_token = null
    state.userid = null
    state.user_is_admin = false
    state.user_can_admin = false
    
  },
  ADMIN_OFF(state) {}
}

export const actions = {
  async fetchUser({ commit, state }) {
    let response = {}
    console.log('fetching user')
    response = await this.$userEndpoint.index()
    console.log(response)
    if (typeof response !== 'undefined' && response.user) {
      commit('SET_USER', response.user.person)
      commit('SET_USERID', response.user.id)
      commit('SET_USER_CAN_ADMIN', response.user.can_admin)
      commit('SET_USER_IS_ADMIN', response.user.is_admin)
      commit('SET_USER_ORGS', response.user.affiliations)
    }
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
    if (typeof response !== 'undefined' && response.organizations) {
      commit('SET_ORGS', response.organizations)
    }
  },
  async fetchBadges({ commit, state }) {
    if (typeof state.badges === 'object' && state.badges.length > 0) {
      return
    }
    let response = {}
    console.log('fetching badges')
    let payload = {
      verified: 1,
      all: 1
    }
    response = await this.$badgesEndpoint.index(payload)
    if (typeof response !== 'undefined' && response.badges) {
      commit('SET_BADGES', response.badges)
    }
  },
  async fetchInterests({ commit, state }) {
    let response = {}
    console.log('fetching interests')
    let payload = {
      all: 1
    }
    response = await this.$interestsEndpoint.index(payload)
    if (typeof response !== 'undefined' && response.research_interests) {
      commit('SET_INTERESTS', response.research_interests)
    }
  },
  async createAffiliation({ commit, state, dispatch }, name) {
    let response = {}
    console.log('adding affiliation: ' + name)
    response = await this.$userAffiliationsEndpoint.create({
      org: { name: name, type: 'Institution' }
    })
    dispatch('fetchUser')
  }
}
