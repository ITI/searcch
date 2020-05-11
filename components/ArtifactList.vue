<template>
  <div>
    <div v-for="artifact in artifacts" :key="artifact.id">
      <ArtifactShort
        :id="artifact.id"
        :title="artifact.title"
        :description="artifact.metadata.description"
        source="zenodo"
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
    }
  }
}
</script>
