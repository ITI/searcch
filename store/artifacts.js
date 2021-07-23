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
  artifacts: [],
  artifact: {},
  search: '',
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
    commit('SET_SEARCH', payload.keywords)
    let a = await this.$artifactsEndpoint.index({
      ...payload
    })
    commit('SET_ARTIFACTS', a.artifacts)
  },
  async fetchArtifact({ commit, state }, payload) {
    console.log('fetching entry ' + payload.id)
    let a = await this.$artifactRecordEndpoint.show(payload.id)
    commit('SET_ARTIFACT', a)
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
  },
  async setRelated({ commit, state, dispatch }, payload) {
    console.log(
      payload.id + ' ' + payload.relation + ' ' + state.artifact.artifact.id
    )
    let response = await this.$relationshipsEndpoint.create({
      artifact_id: state.artifact.artifact.id,
      related_artifact_id: payload.id,
      relation: payload.relation
    })
    dispatch('fetchArtifact', { id: state.artifact.artifact.id })
  }
}
