const renameKeys = (keysMap, obj) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] }
    }),
    {}
  )

const processArtifacts = obj => {
  return renameKeys({ doi: 'id' }, obj)
}

export const state = () => ({
  artifacts: [],
  artifact: {},
  search: '',
  source: ''
})

export const getters = {
  artifacts: state => {
    return state.artifacts
  },
  artifact: state => {
    return state.artifact
  },
  search: state => {
    return state.search
  },
  source: state => {
    return state.source
  }
}

export const mutations = {
  SET_ARTIFACTS(state, artifacts) {
    state.artifacts = artifacts
  },
  SET_ARTIFACT(state, artifact) {
    state.artifact = artifact
  },
  SET_SEARCH(state, search) {
    state.search = search
  },
  SET_SOURCE(state, source) {
    state.source = source
  }
}

export const actions = {
  async fetchArtifacts({ commit, state }, payload) {
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
    commit('SET_SEARCH', payload.keyword)
    if (state.source === 'zenodo') {
      a = await this.$zenodoRecordRepository.index({
        q: payload.keyword,
        size: '20'
      })
      commit('SET_ARTIFACTS', a)
    } else {
      a = await this.$knowledgeGraphSearchRepository.index({
        keywords: payload.keyword
      })
      commit('SET_ARTIFACTS', a.artifacts.map(processArtifacts))
    }
  },
  async fetchArtifact({ commit, state }, payload) {
    let a = {}
    if (
      typeof payload.source !== 'undefined' &&
      state.source !== payload.source
    ) {
      // override state.source if forced from function call
      console.log('overriding source')
      commit('SET_SOURCE', payload.source)
    }
    if (
      typeof state.artifact.id !== 'undefined' &&
      state.artifact.id === payload.id
    ) {
      console.log('returning cached entry ' + payload.id)
      return state.artifact
    } else {
      console.log('fetching entry ' + payload.id)
      if (state.source === 'zenodo') {
        a = await this.$zenodoRecordRepository.show(payload.id)
        commit('SET_ARTIFACT', a)
      } else {
        a = await this.$knowledgeGraphRecordRepository.index({
          doi: payload.id
        })
        commit('SET_ARTIFACT', renameKeys({ doi: 'id' }, a))
      }
    }
  }
}
