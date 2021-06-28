export default {
  SET_USER(state, user) {
    state.user = user
  },
  SET_ORG(state, org) {
    state.organization = org
  },
  SET_USER_ID(state, user_id) {
    state.user_id = user_id
  },
  LOGOUT(state) {
    state.user = null
    state.organization = null
    state.user_id = null
    state.username = null
  }
}
