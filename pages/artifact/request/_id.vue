<template>
  <div>
    <a @click="$router.go(-1)">Back</a>

    <div v-if="artifact.artifact">
        <LazyHydrate when-visible>
          <RequestArtifact :record="artifact"></RequestArtifact>
        </LazyHydrate>
    </div>
    <div v-else>{{ loadingMessage }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {
    RequestArtifact: () => import('@/components/RequestArtifact'),
    LazyHydrate: () => import('vue-lazy-hydration')
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
      loadingMessage: 'Loading...'
    }
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
      artifact_group_id: this.$route.params.artifact_group_id,
      id: this.$route.params.id
    })
  }
}
</script>
