import { defineStore } from 'pinia'

export const systemStore = defineStore('system', {
  state: () => ({
    artifacts: {
      artifacts: [],
      page: 1,
      pages: 1,
      total: 0
    },
    artifact_imports: {
      artifact_imports: [],
      page: 1,
      pages: 1,
      total: 0
    },
    users: {
      users: [],
      page: 1,
      pages: 1,
      total: 0
    },
    sessions: {
      sessions: [],
      page: 1,
      pages: 1,
      total: 0
    },
    importers: [],
    claims: {
      claims: [],
      page: 1,
      pages: 1,
      total: 0
    }
  }),
  actions: {
    logout() {
      this.$reset()
    },
    adminOff() {
      this.$reset()
    },
    async fetchArtifacts(payload) {
      let response = await useNuxtApp().$artifactsEndpoint.index({
        ...payload
      })
      if (typeof response !== 'undefined') {
        this.artifacts = response
        console.log('fetched artifacts (admin)')
      }
    },
    async fetchArtifactImports(payload) {
      let response = await useNuxtApp().$importsEndpoint.index({
        ...payload
      })
      if (typeof response !== 'undefined') {
        this.artifact_imports = response
        console.log('fetched artifact_imports (admin)')
      }
    },
    async fetchUsers(payload) {
      let response = await useNuxtApp().$usersEndpoint.index({
        ...payload
      })
      if (typeof response !== 'undefined') {
        this.users = response
        console.log('fetched users (admin)')
      }
    },
    async fetchSessions(payload) {
      let response = await useNuxtApp().$sessionsEndpoint.index({
        ...payload
      })
      if (typeof response !== 'undefined') {
        this.sessions = response;
        console.log('fetched sessions (admin)')
      }
    },
    async fetchImporters(payload) {
      let response = await useNuxtApp().$importersEndpoint.index({
        ...payload
      })
      if (typeof response !== 'undefined' && response.importers) {
        this.importers = response.importers
        console.log('fetched importers (admin)')
      }
    },
    async fetchClaims(payload) {
      console.log('fetching claims (admin)')
      let response = await useNuxtApp().$adminArtifactClaimEndpoint.index(payload);
      if (typeof response !== 'undefined') {
        this.claims = response
        console.log('fetched claims (admin)')
      }
    },
    async modifyAdminPrivilege(data) {
      let response = {};
      let idx = data.idx;
      let user_id = data.user_id;
      let payload = data;
      delete payload.idx;
      delete payload.user_id;
      console.log('modifying admin privilege');
      response = await useNuxtApp().$adminUpdateUserEndpoint.put(payload, user_id);
      if (typeof response !== 'undefined') {
        console.log('modified admin privilege');
        this.users.users[idx].can_admin = !this.users.users[idx].can_admin;
      } else {
        console.error('failed to modify admin privilege');
      }
    }
  }
})
