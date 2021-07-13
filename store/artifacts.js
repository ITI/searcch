import Vue from 'vue'

const renameKeys = (keysMap, obj) =>
  typeof obj === 'object'
    ? Object.keys(obj).reduce(
        (acc, key) => ({
          ...acc,
          ...{ [keysMap[key] || key]: obj[key] }
        }),
        {}
      )
    : obj

const processArtifacts = obj => {
  return renameKeys({ doi: 'id' }, obj)
}

export const state = () => ({
  artifacts: [],
  artifact: {},
  search: '',
  source: '',
  favorites: [],
  favoritesIDs: {},
  imports: []
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
  favorites: state => {
    return state.favorites
  },
  favoritesIDs: state => {
    return state.favoritesIDs
  },
  imports: state => {
    return state.imports
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
  SET_FAVORITES(state, favorites) {
    state.favorites = favorites
  },
  ADD_FAVORITE(state, id) {
    Vue.set(state.favoritesIDs, id, true)
  },
  REMOVE_FAVORITE(state, id) {
    Vue.delete(state.favoritesIDs, id)
  },
  SET_IMPORTS(state, imports) {
    state.imports = imports
  }
}

export const actions = {
  async fetchArtifacts({ commit, state }, payload) {
    let a = {}
    commit('SET_SEARCH', payload.keywords)
    a = await this.$artifactSearchRepository.index({
      ...payload
    })
    commit('SET_ARTIFACTS', a.artifacts)
  },
  async fetchArtifact({ commit, state }, payload) {
    let a = {}
    if (
      typeof payload.source !== 'undefined' &&
      state.source !== payload.source
    ) {
      // override state.source if forced from function call
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
      a = await this.$artifactRecordRepository.show(payload.id)
      commit('SET_ARTIFACT', renameKeys({ doi: 'id' }, a))
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
  },
  async fetchImports({ commit, state }, payload) {
    let response = await this.$importsEndpoint.index({
      ...payload
    })
    if (response.artifact_imports) {
      commit('SET_IMPORTS', response.artifact_imports)
    }
  }
}
