<template>
  <div>
    <div
      v-for="(artifact, index) in artifacts"
      v-if="index <= limit"
      :key="artifact.id"
    >
      <div v-if="source === 'zenodo'">
        <ArtifactShort
          :id="artifact.id"
          :title="artifact.title"
          :description="artifact.metadata.description"
          :source="source"
        ></ArtifactShort>
      </div>
      <div v-else-if="source === 'kg'">
        <ArtifactShort
          :id="artifact.doi"
          :title="artifact.title"
          :description="artifact.description"
          :source="source"
        ></ArtifactShort>
      </div>
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
