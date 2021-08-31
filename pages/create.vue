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
  head() {
    return {
      title: 'SEARCCH Manual Artifact Creation',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH Hub Manual Artifact Creation'
        }
      ]
    }
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
