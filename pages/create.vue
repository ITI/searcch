<template>
  <div>
    <KGArtifactEdit :record="emptyArtifact"></KGArtifactEdit>
  </div>
</template>

<script>
import KGArtifactEdit from '~/components/KGArtifactEdit'

export default {
  components: {
    KGArtifactEdit
  },
  data() {
    return {
        emptyArtifact: {
            artifact: {
                tags: [],
                relationships: [],
                files: [],
                meta: [],
            }
        }
    }
  }
}
</script>