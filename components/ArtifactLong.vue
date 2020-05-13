<template>
  <div>
    <div v-if="source === 'zenodo'">
      <ZenodoArtifactLong :record="artifact" />
    </div>
    <div v-if="source === 'kg'">
      <KGArtifactLong :record="artifact" />
    </div>
  </div>
</template>

<script>
import ZenodoArtifactLong from '@/components/ZenodoArtifactLong'
import KGArtifactLong from '@/components/KGArtifactLong'

export default {
  components: {
    ZenodoArtifactLong,
    KGArtifactLong
  },
  props: {
    artifact: {
      type: Object,
      required: true
    },
    source: {
      type: String,
      required: true
    }
  }
}
</script>
