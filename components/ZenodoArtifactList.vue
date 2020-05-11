<template>
  <div>
    <div v-for="artifact in artifacts" :key="artifact.id">
      <ZenodoArtifactShort
        :id="artifact.id"
        :title="artifact.title"
        :description="artifact.metadata.description"
      ></ZenodoArtifactShort>
    </div>
  </div>
</template>

<script>
import ZenodoArtifactShort from '@/components/ZenodoArtifactShort'
export default {
  components: {
    ZenodoArtifactShort
  },
  props: {
    artifacts: {
      type: Array,
      required: true
    }
  }
}
</script>
