import Vue from 'vue'

export const state = () => ({
  artifacts: {},
  artifact_imports: {},
  users: {},
  sessions: {},
  importers: []
})

export const getters = {
  artifacts: state => {
    return state.artifacts
  },
  artifact_imports: state => {
    return state.artifact_imports
  },
  users: state => {
    return state.users
  },
  sessions: state => {
    return state.sessions
  },
  importers: state => {
    return state.importers
  }
}

export const mutations = {
  SET_ARTIFACTS(state, artifacts) {
    state.artifacts = artifacts
  },
  SET_ARTIFACT_IMPORTS(state, artifact_imports) {
    state.artifact_imports = artifact_imports
  },
  SET_USERS(state, users) {
    state.users = users
  },
  SET_SESSIONS(state, sessions) {
    state.sessions = sessions
  },
  SET_IMPORTERS(state, importers) {
    state.importers = importers
  },
  LOGOUT(state) {
    state.artifacts = {},
    state.artifact_imports = {},
    state.users = {},
    state.sessions = {}
    state.importers = []
  },
  ADMIN_OFF(state) {
    state.artifacts = {},
    state.artifact_imports = {},
    state.users = {},
    state.sessions = {}
    state.importers = []
  }
}

export const actions = {
  async fetchArtifacts({ commit, state }, payload) {
    let response = await this.$artifactsEndpoint.index({
      ...payload
    })
    if (response) {
      commit('SET_ARTIFACTS', response)
      console.log("fetched artifacts (admin)")
    }
  },
  async fetchArtifactImports({ commit, state }, payload) {
    let response = await this.$importsEndpoint.index({
      ...payload
    })
    if (response) {
      commit('SET_ARTIFACT_IMPORTS', response)
      console.log("fetched artifact_imports (admin)")
    }
  },
  async fetchUsers({ commit, state }, payload) {
    let response = await this.$usersEndpoint.index({
      ...payload
    })
    if (response) {
      commit('SET_USERS', response)
      console.log("fetched users (admin)")
    }
  },
  async fetchSessions({ commit, state }, payload) {
    let response = await this.$sessionsEndpoint.index({
      ...payload
    })
    if (response) {
      commit('SET_SESSIONS', response)
      console.log("fetched sessions (admin)")
    }
  },
  async fetchImporters({ commit, state }, payload) {
    let response = await this.$importersEndpoint.index({
      ...payload
    })
    if (response.importers) {
      commit('SET_IMPORTERS', response.importers)
      console.log("fetched importers (admin)")
    }
  }
}
