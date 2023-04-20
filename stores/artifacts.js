import { defineStore } from 'pinia'

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

// export const state = () => ({
//   artifacts: {
//     artifacts: [],
//     pages: 0,
//     total: 0
//   },
//   artifact: {},
//   myArtifacts: {
//     owned_artifacts: [],
//   },
//   search: '',
//   search_advanced_enabled: true,
//   search_advanced_isopen: false,
//   search_advanced: JSON.parse(JSON.stringify(search_advanced_defaults)),
//   favorites: [],
//   favoritesIDs: {},
//   imports: {
//     artifact_imports: [],
//     pages: 0,
//     total: 0
//   },
//   import: {},
//   loading: false,
//   artifactClaim: {}
// })

// export const mutations = {
//   RESET_ARTIFACTS(state) {
//     state.artifacts = {
//       artifacts: [],
//       pages: 0,
//       total: 0
//     }
//   },
//   SET_SEARCH_ADVANCED(state, search_advanced) {
//     state.search_advanced = search_advanced
//     if (!search_advanced)
//       state.search_advanced_enabled = false
//     if (JSON.stringify(state.search_advanced) === JSON.stringify(search_advanced_defaults))
//       state.search_advanced_isopen = false
//     else
//       state.search_advanced_isopen = true
//   },
//   RESET_SEARCH(state) {
//     state.search = ''
//     state.search_advanced_enabled = false
//     state.search_advanced = {
//       types: ['dataset', 'presentation', 'publication', 'software', 'other'],
//       author: '',
//       org: '',
//       badge_ids: [],
//       sort_criteria: '',
//       sort_type: 'desc',
//     }
//   },
// }

export const artifactsStore = defineStore('artifacts', {
  state: () => ({
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
  }),
  actions: {
    addFavorite(id) {
      this.favoritesIDs[id] = true
    },
    removeFavorite(id) {
      this.favoritesIDs.splice(this.favoritesIDs.indexOf(id), 1)
    },
    setSearchAdvanced(search_advanced) {
      this.search_advanced = search_advanced
      if (!search_advanced)
        this.search_advanced_enabled = false
      if (JSON.stringify(this.search_advanced) === JSON.stringify(search_advanced_defaults))
        this.search_advanced_isopen = false
      else
        this.search_advanced_isopen = true
    },
    resetArtifacts() {
      this.artifacts = {
        artifacts: [],
        pages: 0,
        total: 0
      }
    },
    resetSearch() {
      this.search = ''
      this.search_advanced_enabled = false
      this.search_advanced = {
        types: ['dataset', 'presentation', 'publication', 'software', 'other'],
        author: '',
        org: '',
        badge_ids: [],
        sort_criteria: '',
        sort_type: 'desc',
      }
    },
    async fetchArtifacts({ payload, advanced }) {
      this.loading = true;
      this.resetSearch();
      this.search = payload.keywords;
      this.setSearchAdvanced({ ...advanced });
      let response = await useNuxtApp().$artifactSearchEndpoint.index(payload)
      if (typeof response !== 'undefined') {
        this.artifacts = response;
      }
      this.loading = false;
    },
    async fetchMyArtifacts() {
      this.loading = true;
      let response = await useNuxtApp().$userArtifactsEndpoint.index()
      if (response !== undefined) {
        this.myArtifacts = response
      }
      this.loading = false;
    },
    async fetchRelatedArtifacts(payload) {
      this.loading = true;
      // fetch user artifacts first
      await this.fetchMyArtifacts()
      if (!this.artifacts.length) {
        // recommend artifacts if the user has no artifact
        let response = await useNuxtApp().$artifactRecommendationEndpoint.show(
            [ payload.artifact_group_id, payload.id])
        if (response !== undefined) {
          this.artifacts = response.artifacts
        }
      }
      this.loading = false;
    },
    async fetchArtifact(payload) {
      this.loading = true;
      console.log('fetching entry ' + payload.artifact_group_id + "/" + payload.id)
      var ids = payload.artifact_group_id
      if (payload.id) {
          ids = [ payload.artifact_group_id, payload.id ]
      }
      let response = await useNuxtApp().$artifactEndpoint.show(ids)
      if (typeof response !== 'undefined') {
        this.artifact = response;
      }
      this.loading = false;
    },
    async fetchArtifactClaim(payload) {
      this.loading = true;
      console.log('fetching claim ' + payload.artifact_group_id)
      var id = payload.artifact_group_id
      let response = await useNuxtApp().$artifactClaimEndpoint.show(id)
      if (typeof response !== 'undefined') {
        this.artifactClaim = response
      }
      this.loading = false;
    },
    async fetchFavorites(payload) {
      this.loading = true;
      let response = await useNuxtApp().$findFavoritesEndpoint.show(payload)
      if (typeof response !== 'undefined' && response.artifacts) {
        this.favorites = response.artifacts
        for (let fav in response.artifacts) {
          this.addFavorite(response.artifacts[fav].artifact_group_id)
        }
      }
      this.loading = false;
    },
    async fetchImports(payload) {
      this.loading = true;
      let response = await useNuxtApp().$importsEndpoint.index({
        ...payload
      })
      if (typeof response !== 'undefined' && response.artifact_imports) {
        this.imports = response
      }
      this.loading = false;
    },
    async fetchImport(payload) {
      this.loading = true;
      let response = await useNuxtApp().$importEndpoint.show(payload.id)
      if (typeof response !== 'undefined') {
        this.import = response
      }
      this.loading = false;
    },
    async setRelated( payload) {
      this.loading = true;
      console.log(payload)
      await useNuxtApp().$relationshipsEndpoint.create({
        artifact_group_id: this.artifact.artifact.artifact_group_id,
        related_artifact_group_id: payload.id,
        relation: payload.relation
      })
      this.fetchArtifact({
        artifact_group_id: this.artifact.artifact.artifact_group_id,
        id: this.artifact.artifact.id
      })
      this.loading = false;
    }
  }
});
