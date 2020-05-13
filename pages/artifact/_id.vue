<template>
  <div>
    <router-link to="/search">Back</router-link>
    <ArtifactLong :artifact="artifact" :source="source" />
  </div>
</template>

<script>
import ArtifactLong from '~/components/ArtifactLong'

import { mapState } from 'vuex'

export default {
  components: {
    ArtifactLong
  },
  head() {
    return {
      title: this.artifact.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.artifact.title
        }
      ]
    }
  },
  data() {
    return {
      source: '',
      testing: false
    }
  },
  computed: {
    ...mapState({
      artifact: state => state.artifacts.artifact
    })
  },
  mounted() {
    this.$axios.setToken(this.$store.state.ZENODO_API_KEY, 'Bearer', [
      'post',
      'delete'
    ])
    this.source = this.$route.query.source || 'zenodo'
    this.$store.dispatch('artifacts/fetchArtifact', {
      id: this.source === 'kg' ? this.$route.query.doi : this.$route.params.id,
      source: this.source
    })
  }
}
</script>
