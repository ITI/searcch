<template>
  <div>
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
