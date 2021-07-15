<template>
  <div v-if="artifact.artifact">
    <span v-if="!edit">
      <LazyHydrate when-visible>
        <KGCodeArtifactLong
          v-if="artifact.artifact.type == 'code'"
          :record="artifact"
        />
        <KGArtifactLong v-else :record="artifact" />
      </LazyHydrate>
    </span>
    <span v-else>
      <LazyHydrate when-visible>
        <KGArtifactEdit :record="artifact" />
      </LazyHydrate>
    </span>
  </div>
  <div v-else>{{ loadingMessage }}</div>
</template>

<script>
export default {
  components: {
    KGArtifactLong: () => import('@/components/KGArtifactLong'),
    KGCodeArtifactLong: () => import('@/components/KGCodeArtifactLong'),
    KGArtifactEdit: () => import('@/components/KGArtifactEdit'),
    LazyHydrate: () => import('vue-lazy-hydration')
  },
  props: {
    artifact: {
      type: Object,
      required: true
    },
    edit: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loadingMessage: 'Loading...'
    }
  },
  mounted() {
    setTimeout(() => {
      this.loadingMessage = 'Error loading'
    }, 5000)
  }
}
</script>
