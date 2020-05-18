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

const relevantScores = obj => {
  let relevanceResult = []
  obj.forEach(artifact => {
    relevanceResult.push(artifact.relevance_score)
  })
  return relevanceResult
}

export const state = () => ({
  artifacts: [],
  artifact: {},
  search: '',
  source: '',
  scores: []
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
  },
  scores: state => {
    return state.scores
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
  },
  SET_RELEVANCE_SCORES(state, scores) {
    state.scores = scores
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
      commit(
        'SET_ARTIFACTS',
        a.artifacts.map(processArtifacts).sort(function(a, b) {
          return b.relevance_score - a.relevance_score
        })
      )
      commit('SET_RELEVANCE_SCORES', relevantScores(state.artifacts))
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
