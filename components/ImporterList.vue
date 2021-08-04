<template>
  <div>
    <v-container>
      <v-row v-for="importer in importers" :key="importer.id">
        <v-col>
          <LazyHydrate when-visible>
            <ImporterView :importer="importer"></ImporterView>
          </LazyHydrate>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  components: {
    ImporterView: () => import('@/components/ImporterView'),
    LazyHydrate: () => import('vue-lazy-hydration')
  },
  props: {
    importers: {
      type: Array,
      required: true
    }
  }
}
</script>
