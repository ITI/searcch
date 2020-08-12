<template>
  <div>
    <v-card class="mt-4 mx-auto text-center">
      <v-sheet
        class="v-sheet--offset mx-auto"
        elevation="12"
        max-width="calc(100% - 32px)"
        color="primary"
      >
        <v-sparkline
          :value="sparkScores"
          color="rgba(255, 255, 255, .7)"
        ></v-sparkline>
      </v-sheet>

      <v-card-text class="pt-0">
        <div class="title font-weight-light mb-2 center">Relevance Score</div>
      </v-card-text>
    </v-card>

    <div
      v-for="(artifact, index) in artifacts"
      v-if="index <= limit"
      :key="artifact.id"
    >
      <ArtifactShort :artifact="artifact"></ArtifactShort>
    </div>
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
      artifacts: state => state.artifacts.artifacts,
      source: state => state.artifacts.source,
      scores: state => state.artifacts.scores
    }),
    sparkScores: function() {
      return this.scores.slice(0, 20)
    }
  }
}
</script>
