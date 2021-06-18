<template>
  <div>
    <v-container>
      <v-row v-for="artifact in artifacts" :key="artifact.id">
        <v-col>
          <ArtifactShort :artifact="artifact"></ArtifactShort>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ArtifactShort from '@/components/ArtifactShort'
import { mapState } from 'vuex'

export default {
  components: {
    ArtifactShort
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
