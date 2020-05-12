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
    <ArtifactList
      :artifacts="artifacts"
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
      source: 'zenodo',
      limit: 20
    }
  },
  async fetch({ store, error }) {
    try {
      await store.dispatch('artifacts/fetchArtifacts', {
        source: this.source,
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
    onSubmit(evt) {
      this.$store.dispatch('artifacts/fetchArtifacts', {
        source: this.source,
        keyword: this.search
      })
    }
  }
}
</script>
