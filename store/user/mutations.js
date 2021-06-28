export default {
  SET_USER(state, user) {
    state.user = user
  },
  SET_USER_ID(state, user_id) {
    state.user_id = user_id
  },
  SET_USERNAME(state, username) {
    state.username = username
  },
  LOGOUT(state) {
    state.user = null
    state.user_id = null
    state.username = null
  }
}
