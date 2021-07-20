<template>
  <div>
    <KGArtifactEdit :record="emptyArtifact" create />
  </div>
</template>

<script>
import ArtifactCustom from '~/components/ArtifactCustom'

export default {
  components: {
    KGArtifactEdit: () => import('@/components/KGArtifactEdit')
  },
  data() {
    return {
      emptyArtifact: {
        artifact: {
          title: '',
          description: '',
          url: '',
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
