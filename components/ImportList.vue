<template>
  <div>
    <v-container>
      <v-row v-for="artifact in imports" :key="artifact.id">
        <v-col>
          <LazyHydrate when-visible>
            <ArtifactImportView :artifact="artifact"></ArtifactImportView>
          </LazyHydrate>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  components: {
    ArtifactImportView: () => import('@/components/ArtifactImportView'),
    LazyHydrate: () => import('vue-lazy-hydration')
  },
  props: {
    imports: {
      type: Array,
      required: true
    },
    limit: {
      type: Number,
      required: false
    }
  }
}
</script>
