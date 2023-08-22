<template>
  <div>
    <v-row v-for="artifact in artifacts" :key="getKey(artifact)">
      <v-col>
        <LazyHydrate when-visible>
          <ArtifactShort
            :artifact="artifact"
            :related="related"
            :showEditBtns="showEditBtns"
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
    },
    showEditBtns: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {}
  },
  methods: {
    getKey(artifact) {
      return typeof artifact.id === 'undefined' ? artifact.artifact_group_id : artifact.id
    }
  }
});
</script>
