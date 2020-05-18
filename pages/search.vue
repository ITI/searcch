<template>
  <div>
    <v-flex class="text-center">
      <img src="/images/horiz-tagline.png" alt="SEARCCH Portal" class="mb-5" />
    </v-flex>

    <v-form ref="search" @submit.prevent="onSubmit">
      <v-text-field
        light
        solo
        append-icon="mdi-magnify"
        placeholder="Type keyword..."
        v-model="search"
        loading="true"
        clearable
      >
      </v-text-field>
    </v-form>
    <div hidden>
      <v-select
        v-model="searchsource"
        :items="engines"
        label="Search Engine"
      ></v-select>
    </div>
    <ArtifactList :limit="limit"></ArtifactList>
  </div>
</template>

<script>
import ArtifactList from '~/components/ArtifactList'
import { mapState } from 'vuex'

export default {
  components: {
    ArtifactList
  },
  head() {
    return {
      title: 'SEARCH Artifact Search',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH Portal Artifact Search Results'
        }
      ]
    }
  },
  data() {
    return {
      searchsource: 'kg',
      engines: ['kg', 'zenodo'],
      limit: 20,
      search: ''
    }
  },
  async fetch({ store, error, params }) {
    store.commit('artifacts/SET_SOURCE', 'kg')
    try {
      await store.dispatch('artifacts/fetchArtifacts', {
        keyword: 'cybersecurity'
      })
    } catch (e) {
      error({
        statusCode: 503,
        message: 'Unable to fetch artifacts at this time. Please try again.'
      })
    }
  },
  computed: {
    ...mapState({
      artifacts: state => state.artifacts.artifacts,
      source: state => state.artifacts.source
    })
  },
  methods: {
    onSubmit() {
      this.$store.commit('artifacts/SET_SOURCE', this.searchsource)
      this.$store.dispatch('artifacts/fetchArtifacts', {
        keyword: this.search
      })
    }
  }
}
</script>
