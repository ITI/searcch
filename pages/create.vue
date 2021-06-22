<template>
  <div>
    <ArtifactCustom :record="emptyArtifact"></ArtifactCustom>
  </div>
</template>

<script>
import ArtifactCustom from '~/components/ArtifactCustom'

export default {
  components: {
    ArtifactCustom
  },
  data() {
    return {
      emptyArtifact: {
        artifact: {
          tags: [],
          relationships: [],
          files: [],
          meta: []
        }
      }
    }
  }
}
</script>
