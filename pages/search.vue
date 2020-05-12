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
    <ArtifactList
      v-if="source === 'zenodo'"
      :artifacts="artifacts"
      :source="source"
      :limit="limit"
    ></ArtifactList>
    <ArtifactList
      v-if="source === 'kg'"
      :artifacts="artifacts.artifacts"
      :source="source"
      :limit="limit"
    ></ArtifactList>
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
      source: 'kg',
      searchsource: 'kg',
      engines: ['kg', 'zenodo'],
      limit: 20
    }
  },
  async fetch({ store, error, params }) {
    try {
      await store.dispatch('artifacts/fetchArtifacts', {
        source: 'kg',
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
      artifacts: state => state.artifacts.artifacts
    }),
    search: {
      get() {
        return this.$store.state.artifacts.search
      },
      set(value) {
        this.$store.commit('artifacts/SET_SEARCH', value)
      }
    }
  },
  methods: {
    onSubmit() {
      this.$store.dispatch('artifacts/fetchArtifacts', {
        source: this.searchsource,
        keyword: this.search
      })
      this.source = this.searchsource
    }
  }
}
</script>
