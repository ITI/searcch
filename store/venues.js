export const state = () => ({
  recurringVenues: {
    recurring_venues: [],
  },
  currentVenue: {},
  artifacts: {
    artifacts: [],
    pages: 0,
    total: 0
  },
  recurrenceId: null,
  loading: false,
  artifactsLoading: false
})

export const getters = {
  recurringVenues: state => {
    return state.recurringVenues
  },
  currentVenue: state => {
    return state.currentVenue
  },
  loading: state => {
    return state.loading
  },
  artifactsLoading: state => {
    return state.artifactsLoading
  },
  artifacts: state => {
    return state.artifacts
  },
  recurrenceId: state => {
    return state.recurrenceId
  }
}

export const mutations = {
  SET_RECURRING_VENUES(state, recurringVenues) {
    state.recurringVenues = recurringVenues
  },
  RESET_RECURRING_VENUES(state) {
    state.recurringVenues = {
      recurring_venues: [],
    }
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ARTIFACTS_LOADING(state, loading) {
    state.artifactsLoading = loading
  },
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
  SET_RECURRENCE_ID(state, recurrenceId) {
    state.recurrenceId = recurrenceId
  },
  SET_CURRENT_VENUE(state, currentVenue) {
    state.currentVenue = currentVenue
  }
}

export const actions = {
  async fetchRecurringVenues({ commit, state }) {
    commit('SET_LOADING', true)
    let payload = {
      all_recurring_venues: true,
      verified: true,
    }
    let response = await this.$recurringVenuesEndpoint.index(payload)
    if (typeof response !== 'undefined') {
      commit('SET_RECURRING_VENUES', response)
    }
    commit('SET_LOADING', false)
  },
  async fetchArtifacts({ commit, state }, payload) {
    commit('SET_ARTIFACTS_LOADING', true)
    let response = await this.$artifactSearchEndpoint.index(payload)
    if (typeof response !== 'undefined') {
      commit('SET_ARTIFACTS', response)
    }
    commit('SET_ARTIFACTS_LOADING', false)
  },
}
