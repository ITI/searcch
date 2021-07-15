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
import ArtifactShort from '@/components/ArtifactShort'
import { mapState } from 'vuex'
import LazyHydrate from 'vue-lazy-hydration'

export default {
  components: {
    ArtifactShort,
    LazyHydrate
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
    return {
      relevanceResult: []
    }
  },
  computed: {
    ...mapState({
      source: state => state.artifacts.source
    })
  }
}
</script>
