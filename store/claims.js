export const state = () => ({
  claims: {}
})

export const getters = {
  claims: state => {
    return state.claims
  }
}

export const mutations = {
  SET_CLAIMS(state, claims) {
    state.claims = claims
  }
}

export const actions = {
  async fetchClaims({ commit, state }, payload) {
    console.log('fetching claims (admin)')
    let response = await this.$adminArtifactClaimEndpoint.index(payload);
    if (typeof response !== 'undefined') {
      commit('SET_CLAIMS', response)
      console.log('fetched claims (admin)')
    }
  }
}
