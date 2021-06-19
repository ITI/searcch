export default {
  getUser(state) {
    return state.user
  },

  getName(state) {
    return state.user.person.name
  },
  getUserId(state) {
    return state.user_id
  }
}
