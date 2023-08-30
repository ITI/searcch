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
import { defineAsyncComponent } from 'vue'

export default defineComponent({
  components: {
    ImporterView: defineAsyncComponent(() => import('@/components/ImporterView')),
  },
  props: {
    importers: {
      type: Array,
      required: true
    }
  }
});
</script>
