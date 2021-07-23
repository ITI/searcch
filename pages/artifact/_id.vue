<template>
  <div>
    <a @click="$router.go(-1)">Back</a>
    <ArtifactLong :artifact="artifact" :edit="editing" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {
    ArtifactLong: () => import('@/components/ArtifactLong')
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
      artifact: state => state.artifacts.artifact
    }),
    editing() {
      return this.$route.query.edit == 'true' ? true : false
    }
  },
  mounted() {
    this.$store.dispatch('artifacts/fetchArtifact', {
      id: this.$route.params.id
    })
  }
}
</script>
