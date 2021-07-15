<template>
  <div>
    <v-container>
      <v-row v-for="artifact in imports" :key="artifact.id">
        <v-col>
          <LazyHydrate when-visible>
            <ArtifactImportView :artifact="artifact" />
          </LazyHydrate>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ArtifactImportView from '~/components/ArtifactImportView'
import LazyHydrate from 'vue-lazy-hydration'

export default {
  components: {
    ArtifactImportView,
    LazyHydrate
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
