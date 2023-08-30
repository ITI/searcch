<template>
  <div>
    <v-container>
      <v-row v-for="artifact in imports" :key="artifact.id">
        <v-col>
          <ArtifactImportView :artifact="artifact"></ArtifactImportView>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default defineComponent({
  components: {
    ArtifactImportView: defineAsyncComponent(() => import('@/components/ArtifactImportView'))
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
});
</script>
