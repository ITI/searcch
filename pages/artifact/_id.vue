<template>
  <div>
    <a @click="$router.go(-1)">Back</a>

    <div v-if="artifact.artifact">
      <div v-if="!editing">
        <LazyHydrate when-visible>
          <KGArtifactLong :record="artifact"></KGArtifactLong>
        </LazyHydrate>
      </div>
      <div v-else>
        <LazyHydrate when-visible>
          <KGArtifactEdit :record="artifact"></KGArtifactEdit>
        </LazyHydrate>
      </div>
    </div>
    <div v-else>{{ loadingMessage }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {
    KGArtifactLong: () => import('@/components/KGArtifactLong'),
    KGArtifactEdit: () => import('@/components/KGArtifactEdit'),
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
      id: this.$route.params.id
    })
  }
}
</script>
