<template>
  <div>
    <div
      v-for="(artifact, index) in artifacts"
      v-if="index <= limit"
      :key="artifact.id"
    >
      <ArtifactShort
        v-if="source === 'zenodo' && artifact.metadata"
        :id="artifact.id"
        :title="artifact.title"
        :description="artifact.metadata.description"
        :source="source"
      ></ArtifactShort>
      <ArtifactShort
        v-if="source === 'kg'"
        :doi="artifact.doi"
        :title="artifact.title"
        :description="artifact.description"
        :source="source"
        :score="artifact.relevance_score"
      ></ArtifactShort>
    </div>
  </div>
</template>

<script>
import ArtifactShort from '@/components/ArtifactShort'

export default {
  components: {
    ArtifactShort
  },
  props: {
    artifacts: {
      type: Array,
      required: true
    },
    source: {
      type: String,
      required: true
    },
    limit: {
      type: Number,
      required: true
    }
  }
}
</script>
