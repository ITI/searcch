export const state = () => ({
  artifacts: {},
  artifact_imports: {},
  users: {},
  sessions: {},
  importers: [],
  claims: {}
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
  },
  claims: state => {
    return state.claims
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
  SET_CLAIMS(state, claims) {
    state.claims = claims
  },
  UPDATE_ADMIN_PRIVILEGE(state, item) {
    state.users.users[item.idx].can_admin = item['can_admin'] == 't' ? true : false;
  },
  LOGOUT(state) {
    state.artifacts = {}
    state.artifact_imports = {}
    state.users = {}
    state.sessions = {}
    state.importers = []
    state.claims = {}
  },
  ADMIN_OFF(state) {
    state.artifacts = {},
    state.artifact_imports = {},
    state.users = {},
    state.sessions = {},
    state.claims = {},
    state.importers = []
  }
}

export const actions = {
  async fetchArtifacts({ commit, state }, payload) {
    let response = await this.$artifactsEndpoint.index({
      ...payload
    })
    if (typeof response !== 'undefined') {
      commit('SET_ARTIFACTS', response)
      console.log('fetched artifacts (admin)')
    }
  },
  async fetchArtifactImports({ commit, state }, payload) {
    let response = await this.$importsEndpoint.index({
      ...payload
    })
    if (typeof response !== 'undefined') {
      commit('SET_ARTIFACT_IMPORTS', response)
      console.log('fetched artifact_imports (admin)')
    }
  },
  async fetchUsers({ commit, state }, payload) {
    let response = await this.$usersEndpoint.index({
      ...payload
    })
    if (typeof response !== 'undefined') {
      commit('SET_USERS', response)
      console.log('fetched users (admin)')
    }
  },
  async fetchSessions({ commit, state }, payload) {
    let response = await this.$sessionsEndpoint.index({
      ...payload
    })
    if (typeof response !== 'undefined') {
      commit('SET_SESSIONS', response)
      console.log('fetched sessions (admin)')
    }
  },
  async fetchImporters({ commit, state }, payload) {
    let response = await this.$importersEndpoint.index({
      ...payload
    })
    if (typeof response !== 'undefined' && response.importers) {
      commit('SET_IMPORTERS', response.importers)
      console.log('fetched importers (admin)')
    }
  },
  async fetchClaims({ commit, state }, payload) {
    console.log('fetching claims (admin)')
    let response = await this.$adminArtifactClaimEndpoint.index(payload);
    if (typeof response !== 'undefined') {
      commit('SET_CLAIMS', response)
      console.log('fetched claims (admin)')
    }
  },
  async modifyAdminPrivilege({ commit, state }, payload) {
    let response = {}
    console.log('modifying admin privilege')
    response = await this.$adminUpdatePrivilegeEndpoint.put(payload);
    if (typeof response !== 'undefined') {
      console.log('modified admin privilege');
      commit('UPDATE_ADMIN_PRIVILEGE', payload)
    }
  }
}
