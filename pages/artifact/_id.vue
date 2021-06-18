<template>
  <div>
    <a @click="$router.go(-1)">Back</a>
    <ArtifactLong :artifact="artifact" :edit="editing"/>
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
    return {}
  },
  computed: {
    ...mapState({
      artifact: state => state.artifacts.artifact,
      source: state => state.artifacts.source
    }),
    editing () {
      if (this.$route.query.edit == "true") return true
      return false
    }
  },
  mounted() {
    if (this.source === '') {
      this.$store.commit('artifacts/SET_SOURCE', 'kg')
    }
    if (typeof this.$route.query.source !== 'undefined') {
      this.$store.commit('artifacts/SET_SOURCE', this.$route.query.source)
    }
    if (this.source === 'zenodo' || this.$route.query.source === 'zenodo') {
      this.$axios.setToken(this.$store.state.app.ZENODO_API_KEY, 'Bearer', [
        'post',
        'delete'
      ])
    }
    this.$store.dispatch('artifacts/fetchArtifact', {
      id: this.$route.params.id,
      source: this.$route.query.source ? this.$route.query.source : this.source
    })
    console.log("Artifact", this.artifact)
  }
}
</script>
