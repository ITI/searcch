<template>
  <div>
    <v-container>
      <v-row v-for="artifact in artifacts" :key="artifact.id">
        <v-col>
          <LazyHydrate when-visible>
            <ArtifactShort :artifact="artifact"></ArtifactShort>
          </LazyHydrate>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  components: {
    ArtifactShort: () => import('@/components/ArtifactShort'),
    LazyHydrate: () => import('vue-lazy-hydration')
  },
  props: {
    artifacts: {
      type: Array,
      required: true
    },
    limit: {
      type: Number,
      required: true
    }
  },
  data() {
    return {}
  }
}
</script>
