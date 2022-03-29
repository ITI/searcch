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

export const state = () => ({
  artifacts: {
    artifacts: [],
    pages: 0,
    total: 0
  },
  artifact: {},
  search: '',
  favorites: [],
  favoritesIDs: {},
  imports: [],
  import: {},
  loading: false
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
  favorites: state => {
    return state.favorites
  },
  favoritesIDs: state => {
    return state.favoritesIDs
  },
  imports: state => {
    return state.imports
  },
  import: state => {
    return state.import
  },
  loading: state => {
    return state.loading
  }
}

export const mutations = {
  SET_ARTIFACTS(state, artifacts) {
    state.artifacts = artifacts
  },
  RESET_ARTIFACTS(state) {
    state.artifacts = {
      artifacts: [],
      pages: 0,
      total: 0
    }
  },
  SET_ARTIFACT(state, artifact) {
    state.artifact = artifact
  },
  SET_SEARCH(state, search) {
    state.search = search
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
  },
  SET_IMPORT(state, import_) {
    state.import = import_
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  }
}

export const actions = {
  async fetchArtifacts({ commit, state }, payload) {
    commit('SET_LOADING', true)
    commit('SET_SEARCH', payload.keywords)
    let response = await this.$artifactSearchEndpoint.index({
      ...payload
    })
    if (typeof response !== 'undefined') {
      commit('SET_ARTIFACTS', response)
    }
    commit('SET_LOADING', false)
  },
  async fetchMyArtifacts({ commit }) {
    commit('SET_LOADING', true)
    let response = await this.$userArtifactsEndpoint.index()
    console.log(response)
    if (response !== undefined) {
      commit('SET_ARTIFACTS', { artifacts: response.owned_artifacts })
    }
    commit('SET_LOADING', false)
  },
  async fetchRelatedArtifacts({ commit, dispatch, state }, payload) {
    commit('SET_LOADING', true)
    // fetch user artifacts first
    await dispatch('fetchMyArtifacts')
    if (!state.artifacts.length) {
      // recommend artifacts if the user has no artifact
      let response = await this.$artifactRecommendationEndpoint.show(payload.id)
      if (response !== undefined) {
        commit('SET_ARTIFACTS', response)
      }
    }
    commit('SET_LOADING', false)
  },
  async fetchArtifact({ commit, state }, payload) {
    commit('SET_LOADING', true)
    console.log('fetching entry ' + payload.id)
    let response = await this.$artifactEndpoint.show(payload.id)
    if (typeof response !== 'undefined') {
      commit('SET_ARTIFACT', response)
    }
    commit('SET_LOADING', false)
  },
  async fetchFavorites({ commit, state }, payload) {
    commit('SET_LOADING', true)
    let response = await this.$findFavoritesEndpoint.show(payload)
    if (typeof response !== 'undefined' && response.artifacts) {
      commit('SET_FAVORITES', response.artifacts)
      for (let fav in response.artifacts) {
        commit('ADD_FAVORITE', response.artifacts[fav].id)
      }
    }
    commit('SET_LOADING', false)
  },
  async fetchImports({ commit, state }, payload) {
    commit('SET_LOADING', true)
    let response = await this.$importsEndpoint.index({
      ...payload
    })
    if (typeof response !== 'undefined' && response.artifact_imports) {
      commit('SET_IMPORTS', response.artifact_imports)
    }
    commit('SET_LOADING', false)
  },
  async fetchImport({ commit, state }, payload) {
    commit('SET_LOADING', true)
    let response = await this.$importEndpoint.show(payload.id)
    if (typeof response !== 'undefined') {
      commit('SET_IMPORT', response)
    }
    commit('SET_LOADING', false)
  },
  async setRelated({ commit, state, dispatch }, payload) {
    commit('SET_LOADING', true)
    let response = await this.$relationshipsEndpoint.create({
      artifact_id: state.artifact.artifact.id,
      related_artifact_id: payload.id,
      relation: payload.relation
    })
    dispatch('fetchArtifact', { id: state.artifact.artifact.id })
    commit('SET_LOADING', false)
  }
}
