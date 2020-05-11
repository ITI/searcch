<template>
  <div>
      <div v-if="source === 'zenodo'">
        <ZenodoArtifactLong :record="artifact" />
      </div>
      <div v-else-if="source === 'kg'">
        <ArtifactShort
          :id="artifact.id"
          :title="artifact.title"
          :description="artifact.description"
          :source="source"
        ></ArtifactShort>
      </div>
    </div>
  </div>
</template>

<script>
import ZenodoArtifactLong from '@/components/ZenodoArtifactLong'
import ArtifactShort from '@/components/ArtifactShort'

export default {
  components: {
    ZenodoArtifactLong,
    ArtifactShort
  },
  props: {
    artifact: {
      type: Object,
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
