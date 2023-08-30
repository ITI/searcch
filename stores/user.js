import { defineStore } from 'pinia'

export const userStore = defineStore('user', {
  state: () => ({
    user: null,
    userid: null,
    user_can_admin: false,
    user_is_admin: false,
    organization: [],
    orgs: [],
    badges: [],
    venues: [],
    user_token: null,
    interests: null
  }),
  actions: {
    logout() {
      this.$reset()
    },
    adminOff() {
      // do nothing for now
    },
    async fetchUser() {
      let response = {}
      console.log('fetching user')
      response = await useNuxtApp().$userEndpoint.index()
      if (typeof response !== 'undefined' && response.user) {
        this.user = response.user.person
        this.userid = response.user.id
        this.user_can_admin = response.user.can_admin
        this.user_is_admin = response.user.is_admin
        this.user_orgs = response.user.affiliations
      }
    },
    async setUserToken(user_token) {
      this.user_token = user_token
    },
    async fetchOrgs() {
      if (typeof this.orgs === 'object' && this.orgs.length > 0) {
        return
      }
      let response = {}
      console.log('fetching organizations')
      let payload = {
        verified: 1,
        all: 1
      }
      response = await useNuxtApp().$organizationEndpoint.index(payload)
      if (typeof response !== 'undefined' && response.organizations) {
        this.orgs = response.organizations
      }
    },
    async fetchBadges() {
      if (typeof this.badges === 'object' && this.badges.length > 0) {
        return
      }
      let response = {}
      console.log('fetching badges')
      let payload = {
        verified: 1,
        all: 1
      }
      response = await useNuxtApp().$badgesEndpoint.index(payload)
      if (typeof response !== 'undefined' && response.badges) {
        this.badges = response.badges
      }
    },
    async fetchVenues() {
      if (typeof this.venues === 'object' && this.venues.length > 0) {
        return
      }
      let response = {}
      console.log('fetching venues')
      let payload = {
        verified: 1,
        all: 1
      }
      response = await useNuxtApp().$venuesEndpoint.index(payload)
      if (typeof response !== 'undefined' && response.venues) {
        this.venues = response.venues
      }
    },
    async fetchInterests() {
      let response = {}
      console.log('fetching interests')
      let payload = {
        all: 1
      }
      response = await useNuxtApp().$interestsEndpoint.index(payload)
      if (typeof response !== 'undefined' && response.research_interests) {
        this.interests = response.research_interests
      }
    },
    async createAffiliation(name) {
      let response = {}
      console.log('adding affiliation: ' + name)
      response = await useNuxtApp().$userAffiliationsEndpoint.create({
        org: { name: name, type: 'Institution' }
      })
      this.fetchUser()
    }
  }
});