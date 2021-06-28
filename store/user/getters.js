export default {
  getUser(state) {
    return state.user
  },
  getOrg(state) {
    return state.organization
  },
  getName(state) {
    return state.user.name
  },
  getUserId(state) {
    return state.user_id
  }
}
