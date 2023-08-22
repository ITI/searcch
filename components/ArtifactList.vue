<template>
  <div>
    <v-row v-for="artifact in artifacts" :key="artifact.id">
      <v-col>
        <LazyHydrate when-visible>
          <ArtifactShort
            :artifact="artifact"
            v-bind:related="related"
          ></ArtifactShort>
        </LazyHydrate>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default defineComponent({
  components: {
    ArtifactShort: defineAsyncComponent(() => import('@/components/ArtifactShort')),
  },
  props: {
    artifacts: {
      type: Array,
      required: true
    },
    related: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {}
  }
});
</script>
