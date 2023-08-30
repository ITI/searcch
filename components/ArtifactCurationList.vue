<template>
  <div>
    <v-container>
      <v-row v-for="curation in curations" :key="curation._id">
        <v-col>
          <LazyHydrate when-visible>
            <ArtifactCuration
              :curation="curation.curation"
	      :status="curation.status"
	      :message="curation.message"
            ></ArtifactCuration>
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
    ArtifactCuration: defineAsyncComponent(() => import('@/components/ArtifactCuration')),
  },
  props: {
    curations: {
      type: Array,
      required: true
    }
  },
  data() {
    return {}
  }
});
</script>
