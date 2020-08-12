<template>
  <div>
    <v-container>
      <v-row
        v-for="(artifact, index) in artifacts"
        v-if="index <= limit"
        :key="artifact.id"
      >
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
