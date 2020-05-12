export const state = () => ({
  artifacts: [],
  artifact: {},
  search: ''
})

export const getters = () => ({
  artifacts: state => {
    return state.artifacts
  },
  artifact: state => {
    return state.artifact
  },
  search: state => {
    return state.search
  }
})

export const mutations = {
  SET_ARTIFACTS(state, artifacts) {
    state.artifacts = artifacts
  },
  SET_ARTIFACT(state, artifact) {
    state.artifact = artifact
  },
  SET_SEARCH(state, search) {
    state.search = search
  }
}

export const actions = {
  async fetchArtifacts({ commit }, payload) {
    /* TODO: change to the appropriate initial query -- or don't query

        keyword queries:
            cybersecurity
            phishing
            denial of service
            botnet
            honeypot
            vulnerability
            ciphertext
            man in the middle attack

    */
    let a = {}
    if (payload.source === 'zenodo') {
      a = await this.$zenodoRecordRepository.index({
        q: payload.keyword,
        size: '20'
      })
      commit('SET_ARTIFACTS', a)
    } else {
      a = await this.$knowledgeGraphSearchRepository.index({
        keywords: payload.keyword
      })
      commit('SET_ARTIFACTS', a)
    }
    return a
  },
  async fetchArtifact({ commit }, payload) {
    let target = {}
    if (payload.source === 'zenodo') {
      let a = await this.$zenodoRecordRepository.show(payload.id)
      commit('SET_ARTIFACT', a)
    } else {
      let a = await this.$knowledgeGraphRecordRepository.index({
        doi: payload.id
      })
      commit('SET_ARTIFACT', a)
    }
  }
}
