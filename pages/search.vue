<template>
  <div>
    <v-flex class="text-center">
      <img src="/images/horiz-tagline.png" alt="SEARCCH Portal" class="mb-5" />
    </v-flex>

    <v-form ref="search" @submit="onSubmit">
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
    <ZenodoArtifactList :artifacts="artifacts"></ZenodoArtifactList>
  </div>
</template>

<script>
import ZenodoArtifactList from '~/components/ZenodoArtifactList'

export default {
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
      artifacts: [],
      search: ''
    }
  },
  components: {
    ZenodoArtifactList
  },
  mounted() {
    this.$axios
      .get(this.$store.state.ZENODO_API_URL + 'records/', {
        params: {
          q: this.search || 'cyber',
          size: '20'
        }
      })
      .then(response => {
        this.artifacts = response.data
      })
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      this.$axios
        .get(this.$store.state.ZENODO_API_URL + 'records/', {
          params: {
            q: this.search,
            size: '20'
          }
        })
        .then(response => {
          this.artifacts = response.data
        })
    }
  }
}
</script>
