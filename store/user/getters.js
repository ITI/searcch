export default {
  getUser(state) {
    return state
  },

  getFullname(state) {
    return state.firstname + ' ' + state.lastname
  },

  getUserId(state) {
    return state.user_id
  }
}
