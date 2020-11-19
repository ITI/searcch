import Vue from 'vue'

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
  scores: [],
  favorites: [],
  favoritesIDs: {}
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
  },
  favorites: state => {
    return state.favorites
  },
  favoritesIDs: state => {
    return state.favoritesIDs
  },
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
  },
  SET_FAVORITES(state, favorites) {
    state.favorites = favorites
  },
  ADD_FAVORITE(state, id) {
    Vue.set(state.favoritesIDs, id, true)
  },
  REMOVE_FAVORITE(state, id) {
    Vue.delete(state.favoritesIDs, id)
  },
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
      console.log(a)
      commit('SET_ARTIFACTS', a)
    } else {
      a = await this.$knowledgeGraphSearchRepository.index({
        ...payload
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
        a = await this.$knowledgeGraphRecordRepository.show(payload.id)
        commit('SET_ARTIFACT', renameKeys({ doi: 'id' }, a))
      }
    }
  },
  async fetchFavorites({ commit, state }, payload) {
    let response = await this.$findFavoritesEndpoint.show(payload)
    if (response.artifacts) {
      commit('SET_FAVORITES', response.artifacts)
      for (let fav in response.artifacts) {
        commit('ADD_FAVORITE', response.artifacts[fav].id)
      }
    }
  }
}
