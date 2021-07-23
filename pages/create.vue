<template>
  <div>
    <KGArtifactEdit :record="emptyArtifact" create />
  </div>
</template>

<script>
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
