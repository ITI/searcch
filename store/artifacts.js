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

const search_advanced_defaults = {
  types: ['dataset', 'presentation', 'publication', 'software', 'other'],
  author: '',
  org: '',
  badge_ids: [],
  venue_ids: [],
  sort_criteria: '',
  sort_type: 'desc',
}

export const state = () => ({
  artifacts: {
    artifacts: [],
    pages: 0,
    total: 0
  },
  artifact: {},
  myArtifacts: {
    owned_artifacts: [],
  },
  search: '',
  search_advanced_enabled: true,
  search_advanced_isopen: false,
  search_advanced: JSON.parse(JSON.stringify(search_advanced_defaults)),
  favorites: [],
  favoritesIDs: {},
  imports: {
    artifact_imports: [],
    pages: 0,
    total: 0
  },
  import: {},
  loading: false,
  artifactClaim: {}
})

export const getters = {
  artifacts: state => {
    return state.artifacts
  },
  artifact: state => {
    return state.artifact
  },
  myArtifacts: state => {
    return state.myArtifacts
  },
  search: state => {
    return state.search
  },
  search_advanced_enabled: state => {
    return state.search_advanced_enabled
  },
  search_advanced: state => {
    return state.search_advanced
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
  },
  artifactClaim: state => {
    return state.artifactClaim
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
  SET_SEARCH_ADVANCED(state, search_advanced) {
    state.search_advanced = search_advanced
    if (!search_advanced)
      state.search_advanced_enabled = false
    if (JSON.stringify(state.search_advanced) === JSON.stringify(search_advanced_defaults))
      state.search_advanced_isopen = false
    else
      state.search_advanced_isopen = true
  },
  RESET_SEARCH(state) {
    state.search = ''
    state.search_advanced_enabled = false
    state.search_advanced = {
      types: ['dataset', 'presentation', 'publication', 'software', 'other'],
      author: '',
      org: '',
      badge_ids: [],
      sort_criteria: '',
      sort_type: 'desc',
    }
  },
  SET_MY_ARTIFACTS(state, myArtifacts) {
    state.myArtifacts = myArtifacts
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
  },
  SET_ARTIFACT_CLAIM(state, artifactClaim) {
    state.artifactClaim = artifactClaim
  }
}

export const actions = {
  async fetchArtifacts({ commit, state }, { payload, advanced }) {
    commit('SET_LOADING', true)
    commit('RESET_SEARCH')
    commit('SET_SEARCH', payload.keywords)
    commit('SET_SEARCH_ADVANCED', { ...advanced })
    let response = await this.$artifactSearchEndpoint.index(payload)
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
      commit('SET_MY_ARTIFACTS', response)
    }
    commit('SET_LOADING', false)
  },
  async fetchRelatedArtifacts({ commit, dispatch, state }, payload) {
    commit('SET_LOADING', true)
    // fetch user artifacts first
    await dispatch('fetchMyArtifacts')
    if (!state.artifacts.length) {
      // recommend artifacts if the user has no artifact
      let response = await this.$artifactRecommendationEndpoint.show(
          [ payload.artifact_group_id, payload.id])
      if (response !== undefined) {
        commit('SET_ARTIFACTS', response.artifacts)
      }
    }
    commit('SET_LOADING', false)
  },
  async fetchArtifact({ commit, state }, payload) {
    commit('SET_LOADING', true)
    console.log('fetching entry ' + payload.artifact_group_id + "/" + payload.id)
    var ids = payload.artifact_group_id
    if (payload.id) {
        ids = [ payload.artifact_group_id, payload.id ]
    }
    let response = await this.$artifactEndpoint.show(ids)
    if (typeof response !== 'undefined') {
      commit('SET_ARTIFACT', response)
    }
    commit('SET_LOADING', false)
  },
  async fetchArtifactClaim({ commit, state }, payload) {
    commit('SET_LOADING', true)
    console.log('fetching claim ' + payload.artifact_group_id)
    var id = payload.artifact_group_id
    let response = await this.$artifactClaimEndpoint.show(id)
    if (typeof response !== 'undefined') {
      commit('SET_ARTIFACT_CLAIM', response)
    }
    commit('SET_LOADING', false)
  },
  async fetchFavorites({ commit, state }, payload) {
    commit('SET_LOADING', true)
    let response = await this.$findFavoritesEndpoint.show(payload)
    if (typeof response !== 'undefined' && response.artifacts) {
      commit('SET_FAVORITES', response.artifacts)
      for (let fav in response.artifacts) {
        commit('ADD_FAVORITE', response.artifacts[fav].artifact_group_id)
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
      commit('SET_IMPORTS', response)
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
    console.log(payload)
    let response = await this.$relationshipsEndpoint.create({
      artifact_group_id: state.artifact.artifact.artifact_group_id,
      related_artifact_group_id: payload.id,
      relation: payload.relation
    })
      dispatch('fetchArtifact', { artifact_group_id: state.artifact.artifact.artifact_group_id, id: state.artifact.artifact.id })
    commit('SET_LOADING', false)
  }
}
